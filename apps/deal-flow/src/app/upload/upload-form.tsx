'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface ParsedCompany {
  name: string;
  linkedin_url: string;
}

// Known column header patterns → target field
const COLUMN_PATTERNS: { field: 'name' | 'linkedin_url'; patterns: string[]; label: string }[] = [
  {
    field: 'name',
    label: 'Company Name',
    patterns: ['company_name', 'company', 'name', 'account', 'account_name', 'organisation', 'organization', 'org_name', 'business_name', 'firm', 'entity'],
  },
  {
    field: 'linkedin_url',
    label: 'LinkedIn URL',
    patterns: ['linkedin_url', 'linkedin', 'linkedin_link', 'linkedin_profile', 'li_url', 'company_linkedin', 'linkedin_company_url', 'profile_link', 'profile_url', 'company_url', 'company_link'],
  },
];

function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function autoMapColumns(headers: string[]): Record<string, 'name' | 'linkedin_url' | null> {
  const normalized = headers.map(normalizeHeader);
  const mapping: Record<string, 'name' | 'linkedin_url' | null> = {};

  // Track which fields have been mapped
  const mapped = new Set<string>();

  for (let i = 0; i < headers.length; i++) {
    const norm = normalized[i];
    let matched = false;

    for (const col of COLUMN_PATTERNS) {
      if (mapped.has(col.field)) continue;

      // Exact match first
      if (col.patterns.includes(norm)) {
        mapping[headers[i]] = col.field;
        mapped.add(col.field);
        matched = true;
        break;
      }

      // Partial match (header contains one of the patterns)
      if (col.patterns.some(p => norm.includes(p))) {
        mapping[headers[i]] = col.field;
        mapped.add(col.field);
        matched = true;
        break;
      }
    }

    if (!matched) {
      mapping[headers[i]] = null;
    }
  }

  return mapping;
}

function parseCSV(text: string): string[][] {
  return text.split('\n').map(row => {
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of row) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
      else { current += char; }
    }
    cols.push(current.trim());
    return cols;
  }).filter(row => row.some(cell => cell.length > 0));
}

type UploadMode = 'file' | 'url';

export default function UploadForm({ userId }: { userId: string }) {
  const [mode, setMode] = useState<UploadMode>('file');
  const [url, setUrl] = useState('');
  const [batchName, setBatchName] = useState('');
  const [companies, setCompanies] = useState<ParsedCompany[]>([]);
  const [parsing, setParsing] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  // Column mapping state
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, 'name' | 'linkedin_url' | null>>({});
  const [showMapping, setShowMapping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Process raw CSV text into headers + rows, then auto-map
  const processCSVText = useCallback((text: string, sourceName?: string) => {
    const rows = parseCSV(text);

    if (rows.length < 2) {
      setError('File appears empty or has only headers.');
      return;
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const mapping = autoMapColumns(headers);

    setRawHeaders(headers);
    setRawRows(dataRows);
    setColumnMap(mapping);

    // If we auto-mapped the name column, go straight to preview
    const nameHeader = Object.entries(mapping).find(([, v]) => v === 'name');
    if (nameHeader) {
      applyMapping(headers, dataRows, mapping);
      setShowMapping(false);
    } else {
      // Show mapping UI so user can pick columns
      setShowMapping(true);
    }

    if (!batchName && sourceName) {
      setBatchName(sourceName.replace(/\.csv$/i, ''));
    }
  }, [batchName]);

  function applyMapping(headers: string[], dataRows: string[][], mapping: Record<string, 'name' | 'linkedin_url' | null>) {
    const nameIdx = headers.findIndex(h => mapping[h] === 'name');
    const linkedinIdx = headers.findIndex(h => mapping[h] === 'linkedin_url');

    if (nameIdx === -1) {
      setError('Please map a column to "Company Name".');
      return;
    }

    const parsed: ParsedCompany[] = [];
    for (const row of dataRows) {
      const name = row[nameIdx]?.trim();
      if (!name) continue;
      parsed.push({
        name,
        linkedin_url: linkedinIdx >= 0 ? (row[linkedinIdx]?.trim() || '') : '',
      });
    }

    setCompanies(parsed);
    setShowMapping(false);
    setError('');
  }

  // Handle file drop or selection
  function handleFile(file: File) {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a CSV file.');
      return;
    }

    setError('');
    setParsing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSVText(text, file.name);
      setParsing(false);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setParsing(false);
    };
    reader.readAsText(file);
  }

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  // Google Sheets URL parse
  async function handleParseURL() {
    setError('');
    setParsing(true);
    try {
      const res = await fetch('/api/parse-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setError(json.error || 'Could not fetch file. Make sure it is shared publicly.');
        setParsing(false);
        return;
      }

      processCSVText(json.csv as string, 'Google Sheets Import');
    } catch {
      setError('Failed to parse sheet. Check the URL and try again.');
    }
    setParsing(false);
  }

  // Update a column mapping
  function updateColumnMap(header: string, value: 'name' | 'linkedin_url' | null) {
    // If assigning a field, unassign it from any other column first
    const newMap = { ...columnMap };
    if (value) {
      for (const key of Object.keys(newMap)) {
        if (newMap[key] === value) newMap[key] = null;
      }
    }
    newMap[header] = value;
    setColumnMap(newMap);
  }

  async function handleStartPipeline() {
    if (companies.length === 0) return;
    setInserting(true);
    setError('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: batch, error: batchErr } = await (supabase
        .from('df_batches') as any)
        .insert({
          user_id: userId,
          name: batchName || `Batch ${new Date().toLocaleDateString()}`,
          google_sheets_url: mode === 'url' ? url : null,
          total_companies: companies.length,
          status: 'pending',
        })
        .select()
        .single();

      if (batchErr || !batch) {
        setError(`Failed to create batch: ${batchErr?.message}`);
        setInserting(false);
        return;
      }

      const companyRows = companies.map(c => ({
        batch_id: (batch as any).id,
        user_id: userId,
        name: c.name,
        linkedin_url: c.linkedin_url || null,
        scrape_status: 'pending',
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: insertedCompanies, error: compErr } = await (supabase
        .from('df_companies') as any)
        .insert(companyRows)
        .select();

      if (compErr) {
        setError(`Failed to insert companies: ${compErr.message}`);
        setInserting(false);
        return;
      }

      // Emit company.queued events (fire-and-forget — don't block navigation)
      if (insertedCompanies) {
        for (const company of insertedCompanies as any[]) {
          (supabase as any).rpc('emit_pipeline_event', {
            p_company_id: company.id,
            p_batch_id: (batch as any).id,
            p_event_type: 'company.queued',
            p_actor: 'user',
            p_payload: {},
            p_phase: null,
            p_run_id: null,
          }).then(() => {}).catch(() => {});
        }
      }

      router.push(`/pipeline/${batch.id}`);
    } catch {
      setError('Unexpected error. Check console.');
      setInserting(false);
    }
  }

  const nameIsMapped = Object.values(columnMap).includes('name');
  const linkedinIsMapped = Object.values(columnMap).includes('linkedin_url');

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg-surface)] w-fit">
        <button
          onClick={() => { setMode('file'); setError(''); }}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
            mode === 'file'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          CSV File
        </button>
        <button
          onClick={() => { setMode('url'); setError(''); }}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
            mode === 'url'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Google Sheets URL
        </button>
      </div>

      {/* File upload mode */}
      {mode === 'file' && (
        <div className="card p-6 space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 cursor-pointer transition-all ${
              isDragging
                ? 'border-[var(--accent)] bg-[var(--accent-glow)]'
                : fileName
                  ? 'border-[var(--green)] bg-[var(--green-glow)]'
                  : 'border-[var(--border-subtle)] hover:border-[var(--text-muted)] bg-[var(--bg-input)]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {parsing ? (
              <div className="text-sm text-[var(--text-secondary)]">Parsing...</div>
            ) : fileName && companies.length > 0 ? (
              <>
                <svg className="w-8 h-8 text-[var(--green)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-[var(--text-bright)]">{fileName}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Click or drop to replace</p>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 text-[var(--text-muted)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm font-medium text-[var(--text-primary)]">Drop a CSV file here or click to browse</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Needs at minimum a company name column</p>
              </>
            )}
          </div>
          {error && <p className="text-xs text-[var(--red)]">{error}</p>}
        </div>
      )}

      {/* URL input mode */}
      {mode === 'url' && (
        <div className="card p-6 space-y-4">
          <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Google Sheets or Drive URL
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/... or drive.google.com/file/d/..."
              className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 py-3 text-sm text-[var(--text-bright)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleParseURL}
              disabled={!url || parsing}
              className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
            >
              {parsing ? 'Parsing...' : 'Import'}
            </button>
          </div>
          {error && <p className="text-xs text-[var(--red)]">{error}</p>}
        </div>
      )}

      {/* Column mapping UI */}
      {showMapping && rawHeaders.length > 0 && (
        <div className="card p-6 space-y-4 animate-fade-up">
          <div>
            <h3 className="text-sm font-medium text-[var(--text-bright)]">Map Your Columns</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              We couldn&apos;t auto-detect all columns. Map your CSV headers to the right fields.
            </p>
          </div>

          <div className="space-y-2">
            {rawHeaders.map((header) => {
              const sampleValues = rawRows.slice(0, 3).map(r => r[rawHeaders.indexOf(header)]).filter(Boolean);
              return (
                <div key={header} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-surface)]">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate">{header}</p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
                      {sampleValues.join(' · ') || '(empty)'}
                    </p>
                  </div>
                  <select
                    value={columnMap[header] || ''}
                    onChange={(e) => updateColumnMap(header, (e.target.value || null) as any)}
                    className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="">Skip</option>
                    <option value="name" disabled={nameIsMapped && columnMap[header] !== 'name'}>
                      Company Name
                    </option>
                    <option value="linkedin_url" disabled={linkedinIsMapped && columnMap[header] !== 'linkedin_url'}>
                      LinkedIn URL
                    </option>
                  </select>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => applyMapping(rawHeaders, rawRows, columnMap)}
              disabled={!nameIsMapped}
              className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
            >
              Apply Mapping
            </button>
            {!nameIsMapped && (
              <span className="text-xs text-[var(--text-muted)]">Map at least the Company Name column</span>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {companies.length > 0 && !showMapping && (
        <div className="card p-6 space-y-4 animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--text-bright)]">
                {companies.length} companies found
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {companies.filter(c => c.linkedin_url).length} with LinkedIn URLs
              </p>
            </div>
            {rawHeaders.length > 0 && (
              <button
                onClick={() => setShowMapping(true)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Edit column mapping
              </button>
            )}
          </div>

          <input
            type="text"
            value={batchName}
            onChange={e => setBatchName(e.target.value)}
            placeholder="Batch name..."
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-bright)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />

          <div className="max-h-60 overflow-y-auto rounded-lg border border-[var(--border-subtle)]">
            <table className="w-full text-xs">
              <thead className="bg-[var(--bg-surface)] sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 text-[var(--text-muted)] font-medium">#</th>
                  <th className="text-left px-3 py-2 text-[var(--text-muted)] font-medium">Company</th>
                  <th className="text-left px-3 py-2 text-[var(--text-muted)] font-medium">LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={i} className="border-t border-[var(--border-subtle)]">
                    <td className="px-3 py-2 text-[var(--text-muted)]">{i + 1}</td>
                    <td className="px-3 py-2 text-[var(--text-primary)]">{c.name}</td>
                    <td className="px-3 py-2 text-[var(--text-muted)] truncate max-w-[200px]">
                      {c.linkedin_url || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleStartPipeline}
            disabled={inserting}
            className="w-full rounded-lg bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
          >
            {inserting ? 'Creating pipeline...' : `Start Pipeline (${companies.length} companies)`}
          </button>
        </div>
      )}
    </div>
  );
}

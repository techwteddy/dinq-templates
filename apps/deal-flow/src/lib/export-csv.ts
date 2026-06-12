import type { Company, DataPoint } from '@/lib/types';

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

/** Export a batch of companies as a summary CSV */
export function exportBatchCSV(companies: Company[], filename: string) {
  const headers = [
    'Name', 'Industry', 'Sub-Industry', 'HQ', 'City', 'Country',
    'Founded Year', 'Description',
    'SaaS', 'Ownership', 'Employees', 'Growth % (1yr)', 'Growth % (6m)',
    'Revenue', 'Total Funding', 'Last Funding Amount', 'Last Funding Date',
    'Investors', 'CEO', 'Website', 'LinkedIn URL',
    'Ranking', 'Score Composite', 'Score Growth', 'Score Scale',
    'Score Capital Efficiency', 'Score Product', 'Score Market',
    'Qualification Status', 'Disqualification Reason',
    'CH Business Category', 'Prospect Owner', 'Source of Deal', 'AI Brief',
    'Completeness', 'Scrape Time',
  ];
  const rows = companies.map(c => [
    c.name, c.industry || '', c.sub_industry || '', c.hq_location || '',
    c.location_city || '', c.location_country || '',
    c.founded_year?.toString() || '', c.description || '',
    c.is_saas === true ? 'Yes' : c.is_saas === false ? 'No' : '',
    c.ownership_status || '',
    c.employee_count || '', c.employee_growth_pct?.toString() || '',
    c.headcount_growth_6m?.toString() || '',
    c.revenue_estimate || '', c.funding_total || '',
    c.last_funding_amount || '', c.last_funding_date || '',
    c.investors || '', c.ceo_name || '',
    c.website || '', c.linkedin_url || '',
    c.ranking || '', c.score_composite?.toString() || '',
    c.score_growth?.toString() || '', c.score_scale?.toString() || '',
    c.score_capital_efficiency?.toString() || '', c.score_product?.toString() || '',
    c.score_market?.toString() || '',
    c.qualification_status || '', c.disqualification_reason || '',
    c.ch_business_category || '', c.prospect_owner || '', c.source_of_deal || '',
    c.ai_brief || '',
    Math.round(c.completeness_score).toString(),
    formatDuration(c.scrape_duration_seconds),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => escapeCSV(v)).join(',')).join('\n');
  downloadBlob(csv, filename);
}

/** Export a single company with all its data points as a CSV */
export function exportCompanyCSV(company: Company, dataPoints: DataPoint[]) {
  const headers = ['Category', 'Field', 'Value', 'Source', 'Source URL'];
  const rows = dataPoints.map(dp => [
    dp.category, dp.field_name, dp.field_value || '', dp.source, dp.source_url || '',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => escapeCSV(v)).join(',')).join('\n');
  const filename = `${company.name.replace(/[^a-z0-9]/gi, '_')}_profile.csv`;
  downloadBlob(csv, filename);
}

function downloadBlob(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

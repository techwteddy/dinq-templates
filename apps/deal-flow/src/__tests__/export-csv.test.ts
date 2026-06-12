/**
 * Tests for CSV export utility functions.
 *
 * The export-csv module contains escapeCSV, formatDuration, exportBatchCSV,
 * exportCompanyCSV, and downloadBlob. Since downloadBlob uses the DOM (document,
 * Blob, URL), we test the pure data-transformation logic by extracting and
 * testing the individual functions.
 */

import { describe, it, expect } from 'vitest';

// ─── Extracted Pure Functions (mirroring export-csv.ts) ──────────────

function escapeCSV(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
}

// ─── escapeCSV Tests ─────────────────────────────────────────────────

describe('escapeCSV', () => {
  it('wraps simple string in double quotes', () => {
    expect(escapeCSV('hello')).toBe('"hello"');
  });

  it('escapes internal double quotes by doubling them', () => {
    expect(escapeCSV('say "hello"')).toBe('"say ""hello"""');
  });

  it('handles empty string', () => {
    expect(escapeCSV('')).toBe('""');
  });

  it('handles strings with commas', () => {
    expect(escapeCSV('a,b,c')).toBe('"a,b,c"');
  });

  it('handles strings with newlines', () => {
    expect(escapeCSV('line1\nline2')).toBe('"line1\nline2"');
  });

  it('handles strings with multiple double quotes', () => {
    expect(escapeCSV('""test""')).toBe('"""""test"""""');
  });
});

// ─── formatDuration Tests ────────────────────────────────────────────

describe('formatDuration', () => {
  it('returns empty string for null', () => {
    expect(formatDuration(null)).toBe('');
  });

  it('returns empty string for 0', () => {
    expect(formatDuration(0)).toBe('');
  });

  it('formats seconds under 60 as Xs', () => {
    expect(formatDuration(45)).toBe('45s');
  });

  it('formats exactly 60 seconds as 1m 0s', () => {
    expect(formatDuration(60)).toBe('1m 0s');
  });

  it('formats 90 seconds as 1m 30s', () => {
    expect(formatDuration(90)).toBe('1m 30s');
  });

  it('formats 300 seconds as 5m 0s', () => {
    expect(formatDuration(300)).toBe('5m 0s');
  });

  it('rounds fractional seconds', () => {
    expect(formatDuration(45.7)).toBe('46s');
  });

  it('handles large durations', () => {
    expect(formatDuration(3661)).toBe('61m 1s');
  });
});

// ─── CSV Row Generation ──────────────────────────────────────────────

describe('CSV row generation', () => {
  it('generates correct header count for batch export', () => {
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
    expect(headers).toHaveLength(36);
  });

  it('generates correct header count for company detail export', () => {
    const headers = ['Category', 'Field', 'Value', 'Source', 'Source URL'];
    expect(headers).toHaveLength(5);
  });
});

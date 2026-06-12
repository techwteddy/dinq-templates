/**
 * Tests for pure logic extracted from the results table component.
 *
 * Validates countCriticalMissing, GENERIC_INDUSTRIES set, and
 * RANKING_COLORS mapping -- all pure data logic that doesn't need React.
 */

import { describe, it, expect } from 'vitest';
import type { Company } from '../lib/types';

// ─── Extracted Logic (mirroring results-table.tsx) ───────────────────

const GENERIC_INDUSTRIES = new Set([
  'technology', 'software', 'it', 'information technology', 'software development',
  'saas', 'internet', 'computer software', 'tech', 'digital', 'services',
]);

function countCriticalMissing(c: Partial<Company>): number {
  let missing = 0;
  if (!c.sub_industry || GENERIC_INDUSTRIES.has(c.sub_industry.toLowerCase().trim())) missing++;
  if (c.employee_growth_pct == null) missing++;
  if (!c.revenue_estimate) missing++;
  if (!c.employee_count) missing++;
  if (!c.funding_total) missing++;
  if (c.is_saas == null) missing++;
  if (!c.ownership_status) missing++;
  if (!c.location_country) missing++;
  return missing;
}

const RANKING_COLORS: Record<string, string> = {
  'Great': 'bg-emerald-500 text-white',
  'Good': 'bg-green-500 text-white',
  'High Ok': 'bg-amber-500 text-white',
  'Ok': 'bg-gray-500 text-white',
  'Small & Interesting': 'bg-teal-500 text-white',
  'Poor': 'bg-red-500 text-white',
};

// ─── countCriticalMissing Tests ──────────────────────────────────────

describe('countCriticalMissing', () => {
  it('returns 8 when all critical fields are missing', () => {
    expect(countCriticalMissing({})).toBe(8);
  });

  it('returns 0 when all critical fields are populated', () => {
    const company: Partial<Company> = {
      sub_industry: 'Contract Lifecycle Management',
      employee_growth_pct: 49,
      revenue_estimate: '$10M',
      employee_count: '51-200',
      funding_total: '$58M',
      is_saas: true,
      ownership_status: 'private',
      location_country: 'UK',
    };
    expect(countCriticalMissing(company)).toBe(0);
  });

  it('counts generic sub_industry as missing', () => {
    const company: Partial<Company> = {
      sub_industry: 'Software Development',
      employee_growth_pct: 49,
      revenue_estimate: '$10M',
      employee_count: '51-200',
      funding_total: '$58M',
      is_saas: true,
      ownership_status: 'private',
      location_country: 'UK',
    };
    expect(countCriticalMissing(company)).toBe(1);
  });

  it('treats is_saas=false as populated (not missing)', () => {
    const company: Partial<Company> = {
      sub_industry: 'Insurance Tech',
      employee_growth_pct: 10,
      revenue_estimate: '$5M',
      employee_count: '11-50',
      funding_total: '$2M',
      is_saas: false,
      ownership_status: 'private',
      location_country: 'Germany',
    };
    expect(countCriticalMissing(company)).toBe(0);
  });

  it('treats employee_growth_pct=0 as populated', () => {
    const company: Partial<Company> = {
      sub_industry: 'Fintech',
      employee_growth_pct: 0,
      revenue_estimate: '$10M',
      employee_count: '100',
      funding_total: '$20M',
      is_saas: true,
      ownership_status: 'private',
      location_country: 'US',
    };
    expect(countCriticalMissing(company)).toBe(0);
  });

  it('trims whitespace from sub_industry before checking generics', () => {
    const company: Partial<Company> = {
      sub_industry: '  technology  ',
      employee_growth_pct: 5,
      revenue_estimate: '$1M',
      employee_count: '10',
      funding_total: '$500K',
      is_saas: true,
      ownership_status: 'private',
      location_country: 'UK',
    };
    expect(countCriticalMissing(company)).toBe(1);
  });
});

// ─── GENERIC_INDUSTRIES Tests ────────────────────────────────────────

describe('GENERIC_INDUSTRIES', () => {
  it('contains 11 generic industry labels', () => {
    expect(GENERIC_INDUSTRIES.size).toBe(11);
  });

  it('matches case-insensitively (set stores lowercase)', () => {
    expect(GENERIC_INDUSTRIES.has('technology')).toBe(true);
    expect(GENERIC_INDUSTRIES.has('saas')).toBe(true);
    expect(GENERIC_INDUSTRIES.has('internet')).toBe(true);
  });

  it('does not contain specific industries', () => {
    expect(GENERIC_INDUSTRIES.has('fintech')).toBe(false);
    expect(GENERIC_INDUSTRIES.has('insurtech')).toBe(false);
    expect(GENERIC_INDUSTRIES.has('contract lifecycle management')).toBe(false);
  });
});

// ─── RANKING_COLORS Tests ────────────────────────────────────────────

describe('RANKING_COLORS', () => {
  it('has 6 ranking labels', () => {
    expect(Object.keys(RANKING_COLORS)).toHaveLength(6);
  });

  it('all rankings map to Tailwind color classes', () => {
    for (const [label, classes] of Object.entries(RANKING_COLORS)) {
      expect(classes).toContain('bg-');
      expect(classes).toContain('text-white');
    }
  });

  it('Great uses emerald (positive signal)', () => {
    expect(RANKING_COLORS['Great']).toContain('emerald');
  });

  it('Poor uses red (negative signal)', () => {
    expect(RANKING_COLORS['Poor']).toContain('red');
  });
});

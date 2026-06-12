import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { emitEvent } from '@/lib/pipeline-events';

// Seed data from Rogers Capital and Summize CSVs
const SEED_COMPANIES = [
  {
    name: 'Rogers Capital Ltd',
    linkedin_url: 'https://www.linkedin.com/company/rogers-capital/',
    website: 'https://www.rogerscapital.mu/',
    industry: 'Financial Services',
    founded_year: 2016,
    hq_location: 'Port-Louis, Mauritius',
    employee_count: '501-1000',
    revenue_estimate: 'Rs 12.99B (~USD 285M)',
    ceo_name: 'Kabir Ruhee',
    description: 'Rogers Capital is a diversified financial services company based in Mauritius, subsidiary of ER Group.',
    completeness_score: 85,
    data_points: [
      { category: 'identity', field_name: 'Company Name', field_value: 'Rogers Capital Ltd', source: 'linkedin' },
      { category: 'identity', field_name: 'Trading Name', field_value: 'Rogers Capital', source: 'web_search' },
      { category: 'identity', field_name: 'Website', field_value: 'https://www.rogerscapital.mu/', source: 'web_search' },
      { category: 'identity', field_name: 'LinkedIn URL', field_value: 'https://www.linkedin.com/company/rogers-capital/', source: 'linkedin' },
      { category: 'identity', field_name: 'Industry', field_value: 'Financial Services', source: 'linkedin' },
      { category: 'identity', field_name: 'Founded', field_value: '2016', source: 'linkedin' },
      { category: 'identity', field_name: 'Registration Number', field_value: 'C11019', source: 'companies_house' },
      { category: 'location', field_name: 'Headquarters', field_value: 'Rogers House, Port-Louis, Mauritius', source: 'linkedin' },
      { category: 'location', field_name: 'Full Address', field_value: '5 President John Kennedy Street, Rogers House, Port-Louis 11320, MU', source: 'linkedin' },
      { category: 'location', field_name: 'Phone 1', field_value: '+230 203 1100', source: 'web_search' },
      { category: 'size', field_name: 'Employee Count (LinkedIn)', field_value: '501-1000', source: 'linkedin' },
      { category: 'size', field_name: 'LinkedIn Members', field_value: '615', source: 'linkedin' },
      { category: 'size', field_name: 'Employee Count (ZoomInfo)', field_value: '582', source: 'web_search' },
      { category: 'leadership', field_name: 'CEO', field_value: 'Kabir Ruhee', source: 'web_search' },
      { category: 'leadership', field_name: 'MD - Credit', field_value: 'Marc Ah Ching', source: 'web_search' },
      { category: 'leadership', field_name: 'MD - Technology', field_value: 'Dev Hurkoo', source: 'web_search' },
      { category: 'corporate', field_name: 'Parent Company', field_value: 'ER Group (formed July 2025)', source: 'web_search' },
      { category: 'corporate', field_name: 'Specialties', field_value: 'Corporate Services, Technology Services, Credit Services', source: 'linkedin' },
      { category: 'corporate', field_name: 'Subsidiaries - Technology', field_value: 'Rogers Capital Technology Services Ltd (C27054)', source: 'companies_house' },
      { category: 'financials', field_name: 'Revenue FY2024', field_value: 'Rs 12.99 billion (~USD 285M)', source: 'financial' },
      { category: 'financials', field_name: 'Net Profit FY2024', field_value: 'Rs 3.7 billion (~USD 81M)', source: 'financial' },
      { category: 'financials', field_name: 'Revenue Growth 9M YoY', field_value: '16%', source: 'financial' },
      { category: 'financials', field_name: 'Stock Exchange', field_value: 'SEM (ROGERS.mu)', source: 'financial' },
      { category: 'digital', field_name: 'LinkedIn Followers', field_value: '55,000', source: 'linkedin' },
      { category: 'digital', field_name: 'Facebook', field_value: 'https://www.facebook.com/rogerscapital', source: 'web_search' },
      { category: 'market', field_name: 'Comparable Companies', field_value: 'MCB Group, IBL Together, Absa Mauritius, Investec, Nedbank', source: 'linkedin' },
    ],
  },
  {
    name: 'Summize Limited',
    linkedin_url: 'https://www.linkedin.com/company/summizeltd/',
    website: 'https://www.summize.com/',
    industry: 'Software Development',
    sub_industry: 'Contract Lifecycle Management (CLM)',
    founded_year: 2018,
    hq_location: 'Manchester, UK',
    employee_count: '51-200',
    employee_growth_pct: 49,
    revenue_estimate: null,
    funding_total: '~$58M+',
    ceo_name: 'Tom Dunlop',
    description: 'AI-powered Contract Lifecycle Management software. Creating contract clarity for the whole company.',
    completeness_score: 92,
    data_points: [
      { category: 'identity', field_name: 'Company Name', field_value: 'Summize Limited', source: 'companies_house' },
      { category: 'identity', field_name: 'Trading Name', field_value: 'Summize', source: 'linkedin' },
      { category: 'identity', field_name: 'Website', field_value: 'https://www.summize.com/', source: 'linkedin' },
      { category: 'identity', field_name: 'Industry', field_value: 'Software Development', source: 'linkedin' },
      { category: 'identity', field_name: 'Sub-Industry', field_value: 'Contract Lifecycle Management (CLM) Software', source: 'linkedin' },
      { category: 'identity', field_name: 'Founded', field_value: '2018', source: 'linkedin' },
      { category: 'identity', field_name: 'Registration Number', field_value: '11421457', source: 'companies_house' },
      { category: 'identity', field_name: 'Company Status', field_value: 'Active', source: 'companies_house' },
      { category: 'identity', field_name: 'SIC Code', field_value: '58290 - Other software publishing', source: 'companies_house' },
      { category: 'location', field_name: 'Registered Address', field_value: '117-119 Portland Street, Manchester, England, M1 6ED', source: 'companies_house' },
      { category: 'location', field_name: 'HQ', field_value: 'Manchester Greater Manchester', source: 'linkedin' },
      { category: 'location', field_name: 'Office 2', field_value: 'Boston USA', source: 'linkedin' },
      { category: 'location', field_name: 'Office 3', field_value: 'San Diego USA', source: 'linkedin' },
      { category: 'size', field_name: 'Employee Range', field_value: '51-200', source: 'linkedin' },
      { category: 'size', field_name: 'LinkedIn Members', field_value: '100', source: 'linkedin' },
      { category: 'size', field_name: 'Headcount Growth FY Jun 2025', field_value: '49% YoY', source: 'web_search' },
      { category: 'size', field_name: 'Headcount Growth H2 2025', field_value: '59% YoY', source: 'web_search' },
      { category: 'leadership', field_name: 'Founder/CEO', field_value: 'Tom Dunlop (former General Counsel)', source: 'web_search' },
      { category: 'leadership', field_name: 'Director - Board Member A', field_value: 'Appointed 12 Jan 2026 (Investor)', source: 'companies_house' },
      { category: 'leadership', field_name: 'Director - Board Member B', field_value: 'Appointed 12 Jan 2026 (Investor)', source: 'companies_house' },
      { category: 'financials', field_name: 'ARR Growth (5 consecutive years)', field_value: '100%+ YoY', source: 'web_search' },
      { category: 'financials', field_name: 'ARR Growth H2 2025', field_value: '97% YoY', source: 'financial' },
      { category: 'financials', field_name: 'US ARR Growth FY Jun 2025', field_value: '215% YoY', source: 'financial' },
      { category: 'financials', field_name: 'Funding - Pre-Seed', field_value: '£1.5M from Maven Capital Partners', source: 'web_search' },
      { category: 'financials', field_name: 'Funding - Series A (Oct 2022)', field_value: '£5M from YFM Equity + Maven', source: 'web_search' },
      { category: 'financials', field_name: 'Funding - Growth (Jan 2026)', field_value: '$50M from Growth Equity Partners + Federated Hermes PE', source: 'web_search' },
      { category: 'financials', field_name: 'Total Known Funding', field_value: '~$58M+', source: 'web_search' },
      { category: 'digital', field_name: 'LinkedIn Followers', field_value: '9,000', source: 'linkedin' },
      { category: 'market', field_name: 'Notable Customers', field_value: 'Revolut, Miami Heat, Matillion, Huel, IONITY, SHL Medical, SeatGeek', source: 'linkedin' },
      { category: 'market', field_name: 'Competitors', field_value: 'Zoho Contracts, Docusign CLM, Sirion CLM', source: 'linkedin' },
    ],
  },
];

export async function POST() {
  const admin = getAdminClient();

  // Get first user (for demo purposes)
  const { data: users } = await admin.auth.admin.listUsers();
  const userId = users?.users?.[0]?.id;
  if (!userId) {
    return NextResponse.json({ error: 'No users found' }, { status: 400 });
  }

  // Create batch
  const { data: batch, error: batchErr } = await admin
    .from('df_batches')
    .insert({
      user_id: userId,
      name: 'Demo - Pre-Scraped Companies',
      total_companies: SEED_COMPANIES.length,
      scraped_count: SEED_COMPANIES.length,
      status: 'complete',
      avg_scrape_seconds: 45,
    })
    .select()
    .single();

  if (batchErr) return NextResponse.json({ error: batchErr.message }, { status: 500 });

  for (const seed of SEED_COMPANIES) {
    const { data_points, ...companyData } = seed;

    // Insert company
    const { data: company, error: compErr } = await admin
      .from('df_companies')
      .insert({
        ...companyData,
        batch_id: batch.id,
        user_id: userId,
        scrape_status: 'scraped',
        scrape_started_at: new Date(Date.now() - 90000).toISOString(),
        scrape_completed_at: new Date(Date.now() - 45000).toISOString(),
        scrape_duration_seconds: 45,
      })
      .select()
      .single();

    if (compErr) return NextResponse.json({ error: compErr.message }, { status: 500 });

    // Insert data points
    const points = data_points.map(dp => ({
      company_id: company.id,
      ...dp,
    }));
    await admin.from('df_data_points').insert(points);

    // Emit seed events for timeline history
    await emitEvent(admin, {
      companyId: company.id,
      batchId: batch.id,
      eventType: 'company.queued',
      actor: 'system',
      payload: { seeded: true },
    });
    await emitEvent(admin, {
      companyId: company.id,
      batchId: batch.id,
      eventType: 'company.scrape_completed',
      actor: 'system',
      payload: { seeded: true, data_points: data_points.length },
    });
  }

  return NextResponse.json({ success: true, batch_id: batch.id });
}

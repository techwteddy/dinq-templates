-- Demo seed: generic sample data so the dashboard looks alive on first run.
-- Safe to delete this file before going to production with your own data.

-- =========================================================
-- ACCESS BOOTSTRAP
-- =========================================================
-- IMPORTANT: signups are gated by the allowlist. Add YOUR email here (as admin)
-- BEFORE signing up, otherwise the signup trigger will reject the new user.
-- Replace the address below with your own.
insert into public.allowed_emails (email, role) values
  ('you@example.com', 'admin')
on conflict (email) do nothing;

-- =========================================================
-- CATEGORIES
-- =========================================================
insert into public.categories (name, type, color, icon) values
  ('Salary',        'income',  '#16a34a', 'Wallet'),
  ('Freelance',     'income',  '#0ea5e9', 'Laptop'),
  ('Investments',   'income',  '#84cc16', 'TrendingUp'),
  ('Other Income',  'income',  '#10b981', 'Plus')
on conflict do nothing;

insert into public.categories (name, type, color, icon) values
  ('Housing',       'expense', '#dc2626', 'Home'),
  ('Groceries',     'expense', '#b91c1c', 'ShoppingCart'),
  ('Utilities',     'expense', '#6366f1', 'Plug'),
  ('Transport',     'expense', '#22c55e', 'Car'),
  ('Dining',        'expense', '#ec4899', 'Utensils'),
  ('Health',        'expense', '#a855f7', 'HeartPulse'),
  ('Subscriptions', 'expense', '#f97316', 'CreditCard'),
  ('Taxes',         'expense', '#ef4444', 'FileText'),
  ('Other Expense', 'expense', '#71717a', 'MoreHorizontal')
on conflict do nothing;

-- =========================================================
-- ACCOUNTS
-- =========================================================
insert into public.accounts (name, bank, type, initial_balance, currency, color) values
  ('Checking',    'Demo Bank', 'checking',    5000.00, 'USD', '#2563eb'),
  ('Savings',     'Demo Bank', 'savings',    12000.00, 'USD', '#16a34a'),
  ('Credit Card', 'Demo Bank', 'credit_card',    0.00, 'USD', '#dc2626'),
  ('Cash',         null,       'cash',         300.00, 'USD', '#64748b')
on conflict do nothing;

-- =========================================================
-- TRANSACTIONS (relative to current date so they always look current)
-- =========================================================
do $$
declare
  acc_checking uuid := (select id from public.accounts where name = 'Checking' limit 1);
  acc_card     uuid := (select id from public.accounts where name = 'Credit Card' limit 1);
begin
  -- Income, paid, last two months and this month
  insert into public.transactions (description, type, amount, category_id, account_id, accrual_date, due_date, payment_date, payment_method)
  values
    ('Monthly salary', 'income', 4200.00, (select id from public.categories where name='Salary'), acc_checking, current_date - 40, current_date - 40, current_date - 40, 'bank_transfer'),
    ('Monthly salary', 'income', 4200.00, (select id from public.categories where name='Salary'), acc_checking, current_date - 10, current_date - 10, current_date - 10, 'bank_transfer'),
    ('Website project', 'income', 1500.00, (select id from public.categories where name='Freelance'), acc_checking, current_date - 18, current_date - 18, current_date - 18, 'bank_transfer'),
    ('Dividends',       'income',  120.00, (select id from public.categories where name='Investments'), acc_checking, current_date - 5, current_date - 5, current_date - 5, 'bank_transfer');

  -- Expenses, paid
  insert into public.transactions (description, type, amount, category_id, account_id, accrual_date, due_date, payment_date, payment_method)
  values
    ('Rent',            'expense', 1300.00, (select id from public.categories where name='Housing'), acc_checking, current_date - 8, current_date - 8, current_date - 8, 'bank_transfer'),
    ('Supermarket',     'expense',  240.50, (select id from public.categories where name='Groceries'), acc_card, current_date - 6, current_date - 6, current_date - 6, 'credit_card'),
    ('Electricity bill','expense',   95.30, (select id from public.categories where name='Utilities'), acc_checking, current_date - 4, current_date - 4, current_date - 4, 'bank_transfer'),
    ('Fuel',            'expense',   60.00, (select id from public.categories where name='Transport'), acc_card, current_date - 3, current_date - 3, current_date - 3, 'credit_card'),
    ('Restaurant',      'expense',   48.90, (select id from public.categories where name='Dining'), acc_card, current_date - 2, current_date - 2, current_date - 2, 'credit_card'),
    ('Streaming',       'expense',   15.99, (select id from public.categories where name='Subscriptions'), acc_card, current_date - 12, current_date - 12, current_date - 12, 'credit_card');

  -- Upcoming / pending (no payment_date yet)
  insert into public.transactions (description, type, amount, category_id, account_id, accrual_date, due_date, payment_method)
  values
    ('Rent',            'expense', 1300.00, (select id from public.categories where name='Housing'), acc_checking, current_date + 3, current_date + 3, 'bank_transfer'),
    ('Internet',        'expense',   59.90, (select id from public.categories where name='Utilities'), acc_checking, current_date + 5, current_date + 5, 'bank_transfer'),
    ('Gym',             'expense',   39.00, (select id from public.categories where name='Health'), acc_card, current_date + 6, current_date + 6, 'credit_card'),
    ('Quarterly taxes', 'expense',  420.00, (select id from public.categories where name='Taxes'), acc_checking, current_date + 12, current_date + 12, 'bank_transfer');

  -- One overdue, to exercise the "overdue" status
  insert into public.transactions (description, type, amount, category_id, account_id, accrual_date, due_date, payment_method)
  values
    ('Phone bill',      'expense',   29.90, (select id from public.categories where name='Utilities'), acc_checking, current_date - 2, current_date - 2, 'bank_transfer');
end$$;

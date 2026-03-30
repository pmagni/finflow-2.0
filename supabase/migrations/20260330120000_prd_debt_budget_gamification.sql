-- PRD alignment: debt fields, budget allocations, debt plan extra payment, gamification RLS

alter table public.debts add column if not exists institution text;
alter table public.debts add column if not exists term_months integer;

alter table public.budgets add column if not exists debt_payment_allocation numeric default 0;
alter table public.budgets add column if not exists leisure_allocation numeric default 0;

alter table public.debt_plans add column if not exists extra_monthly_payment numeric default 0;

-- Restrict gamification_events inserts to own user rows
drop policy if exists "System can insert gamification events." on public.gamification_events;

create policy "Users can insert their own gamification events."
on public.gamification_events for insert
with check (auth.uid() = user_id);

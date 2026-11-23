create table if not exists petition_support (
  id         text primary key,
  created_at timestamptz not null default now()
);

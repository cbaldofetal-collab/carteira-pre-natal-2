create table if not exists perfis (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  dpp date not null, -- data provável do parto
  created_at timestamp with time zone default now()
);

create table if not exists exames (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references perfis(id) on delete cascade,
  tipo text not null,
  data date not null,
  observacoes text,
  created_at timestamp with time zone default now()
);

-- index para consultas rápidas por perfil
create index if not exists exames_perfil_idx on exames(perfil_id, data);

-- política RLS básica
alter table perfis enable row level security;
alter table exames enable row level security;

-- regras públicas de leitura/escrita com auth (ajuste conforme necessidade)
create policy if not exists "perfil_read" on perfis for select using (true);
create policy if not exists "perfil_write" on perfis for insert with check (true);
create policy if not exists "exame_read" on exames for select using (true);
create policy if not exists "exame_write" on exames for insert with check (true);

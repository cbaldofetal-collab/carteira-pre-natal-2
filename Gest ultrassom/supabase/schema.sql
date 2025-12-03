-- Tabela de perfis de gestantes
create table if not exists perfis (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  dum date, -- data da última menstruação
  dpp date not null, -- data provável do parto
  dpp_corrigida date, -- DPP corrigida pelo USG
  email text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de exames
create table if not exists exames (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references perfis(id) on delete cascade,
  tipo text not null, -- tipo do exame (ex: "1tri_usg", "morfologico")
  nome text not null, -- nome legível do exame
  semana_alvo integer, -- semana ideal para realização
  data_prevista date, -- data calculada automaticamente
  status text default 'pendente' check (status in ('pendente', 'agendado', 'realizado')),
  agendado_para date, -- data que foi agendado
  realizado_em date, -- data que foi realizado
  observacoes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabela de anexos (documentos, imagens de exames)
create table if not exists anexos (
  id uuid primary key default gen_random_uuid(),
  exame_id uuid references exames(id) on delete cascade,
  perfil_id uuid references perfis(id) on delete cascade,
  nome_arquivo text not null,
  caminho_storage text not null, -- caminho no Supabase Storage
  tipo_mime text,
  tamanho_bytes bigint,
  created_at timestamp with time zone default now()
);

-- Tabela de tokens FCM para notificações
create table if not exists fcm_tokens (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references perfis(id) on delete cascade,
  token text not null unique,
  created_at timestamp with time zone default now()
);

-- Índices para performance
create index if not exists exames_perfil_idx on exames(perfil_id, data_prevista);
create index if not exists exames_status_idx on exames(perfil_id, status);
create index if not exists anexos_exame_idx on anexos(exame_id);
create index if not exists anexos_perfil_idx on anexos(perfil_id);
create index if not exists fcm_tokens_perfil_idx on fcm_tokens(perfil_id);

-- Habilitar RLS (Row Level Security)
alter table perfis enable row level security;
alter table exames enable row level security;
alter table anexos enable row level security;
alter table fcm_tokens enable row level security;

-- Políticas RLS para perfis
create policy if not exists "perfil_read" on perfis for select using (true);
create policy if not exists "perfil_insert" on perfis for insert with check (true);
create policy if not exists "perfil_update" on perfis for update using (true);
create policy if not exists "perfil_delete" on perfis for delete using (true);

-- Políticas RLS para exames
create policy if not exists "exame_read" on exames for select using (true);
create policy if not exists "exame_insert" on exames for insert with check (true);
create policy if not exists "exame_update" on exames for update using (true);
create policy if not exists "exame_delete" on exames for delete using (true);

-- Políticas RLS para anexos
create policy if not exists "anexo_read" on anexos for select using (true);
create policy if not exists "anexo_insert" on anexos for insert with check (true);
create policy if not exists "anexo_delete" on anexos for delete using (true);

-- Políticas RLS para FCM tokens
create policy if not exists "fcm_read" on fcm_tokens for select using (true);
create policy if not exists "fcm_insert" on fcm_tokens for insert with check (true);
create policy if not exists "fcm_delete" on fcm_tokens for delete using (true);

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para atualizar updated_at
create trigger update_perfis_updated_at before update on perfis
  for each row execute function update_updated_at_column();

create trigger update_exames_updated_at before update on exames
  for each row execute function update_updated_at_column();

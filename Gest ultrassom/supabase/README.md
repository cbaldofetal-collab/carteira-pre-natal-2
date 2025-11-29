# Supabase

## Funções Edge

### Deploy

1. Instale o CLI: `npm i -g supabase`
2. Login: `supabase login`
3. Link: `supabase link --project-ref <PROJECT_REF>`
4. Deploy:
   - `supabase functions deploy health`
   - `supabase functions deploy registerToken`

### Variáveis

- `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são gerenciadas pelo Supabase nas Functions.

## Banco de Dados

Execute `schema.sql` no SQL Editor para criar `perfis`, `exames` e `fcm_tokens`.

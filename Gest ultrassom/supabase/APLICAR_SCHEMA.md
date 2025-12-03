# Como Aplicar o Schema no Supabase

## Passo a Passo

1. **Acesse o Dashboard do Supabase**
   - Vá para: https://app.supabase.com
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **"SQL Editor"**

3. **Execute o Schema**
   - Clique em **"New Query"**
   - Copie todo o conteúdo do arquivo `schema.sql`
   - Cole no editor
   - Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)

4. **Configurar Storage (para anexos)**
   - No menu lateral, clique em **"Storage"**
   - Clique em **"Create a new bucket"**
   - Nome do bucket: `exam-attachments`
   - **Público:** Não (deixe privado)
   - Clique em **"Create Bucket"**

5. **Configurar Políticas do Storage**
   - Clique no bucket `exam-attachments`
   - Vá em **"Policies"**
   - Clique em **"New Policy"**
   - Selecione **"Custom Policy"**
   
   **Policy para Upload (INSERT):**
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO public
   WITH CHECK (bucket_id = 'exam-attachments');
   ```
   
   **Policy para Leitura (SELECT):**
   ```sql
   CREATE POLICY "Allow public reads"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'exam-attachments');
   ```
   
   **Policy para Deleção (DELETE):**
   ```sql
   CREATE POLICY "Allow authenticated deletes"
   ON storage.objects FOR DELETE
   TO public
   USING (bucket_id = 'exam-attachments');
   ```

## Verificação

Execute esta query para verificar se tudo foi criado:

```sql
-- Verificar tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('perfis', 'exames', 'anexos', 'fcm_tokens');

-- Verificar estrutura da tabela exames
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'exames';

-- Verificar políticas RLS
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('perfis', 'exames', 'anexos');
```

## Notas Importantes

- ⚠️ **Backup:** Se você já tem dados no Supabase, faça backup antes de aplicar
- ✅ **Idempotente:** O schema usa `IF NOT EXISTS`, então pode ser executado múltiplas vezes
- 🔒 **RLS:** As políticas estão abertas (`true`), ajuste conforme necessidade de autenticação

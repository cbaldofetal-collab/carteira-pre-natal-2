# 🚀 DEPLOY AUTOMÁTICO VIA GITHUB ACTIONS

## ✨ O QUE FOI CRIADO

Um workflow do GitHub Actions que:
- ✅ Compila Flutter automaticamente na nuvem (ZERO instalação local)
- ✅ Gera a pasta `build/web` 
- ✅ Permite download dos arquivos compilados
- ✅ (Opcional) Deploy automático no Netlify

---

## 📋 PASSO A PASSO

### **1. CRIAR/ATUALIZAR REPOSITÓRIO NO GITHUB**

Se você ainda **NÃO tem** um repositório GitHub para este projeto:

```bash
# No terminal, vá para a pasta do projeto
cd "/Users/carlosalbertoraimundobaldo/carteira-pre-natal/Gest ultrassom"

# Inicializar git (se ainda não tiver)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Integração completa com Supabase"

# Criar repositório no GitHub (via navegador):
# 1. Acesse https://github.com/new
# 2. Nome: gest-ultrassom
# 3. Público ou Privado (sua escolha)
# 4. NÃO marque "Initialize with README"
# 5. Clique em "Create repository"

# Conectar ao repositório remoto (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/gest-ultrassom.git
git branch -M main
git push -u origin main
```

---

### **2. O BUILD COMEÇA AUTOMATICAMENTE!** 🎉

Assim que você fizer `git push`, o GitHub Actions vai:
1. ✅ Baixar o código
2. ✅ Instalar Flutter
3. ✅ Compilar para Web
4. ✅ Gerar `build/web`

Você pode acompanhar em:
```
https://github.com/SEU-USUARIO/gest-ultrassom/actions
```

---

### **3. BAIXAR OS ARQUIVOS COMPILADOS**

Depois que o workflow terminar (~5 minutos):

1. Vá em: `https://github.com/SEU-USUARIO/gest-ultrassom/actions`
2. Clique no workflow mais recente (com ✓ verde)
3. Role até o final da página
4. Em **"Artifacts"**, clique em **"flutter-web-build"**
5. Baixe o arquivo ZIP
6. Descompacte
7. Arraste a pasta pro Netlify!

---

### **4. DEPLOY NO NETLIFY**

#### **OPÇÃO A: Manual (Arrastar e Soltar)**
1. Acesse https://app.netlify.com
2. Clique em "Add new site" → "Deploy manually"
3. Arraste a pasta `build/web` (que você baixou)
4. Pronto! ✅

#### **OPÇÃO B: Automático via GitHub**
1. No Netlify, vá em "Add new site" → "Import from Git"
2. Conecte seu GitHub
3. Selecione o repositório `gest-ultrassom`
4. Configurações de build:
   - **Build command:** `flutter build web --release`
   - **Publish directory:** `build/web`
5. Em "Environment variables", adicione:
   - (Não precisa, as credenciais já estão no código!)
6. Clique em "Deploy site"

#### **OPÇÃO C: Deploy Automático via Secrets**

Se quiser deploy 100% automático, configure secrets no GitHub:

1. Vá em `https://github.com/SEU-USUARIO/gest-ultrassom/settings/secrets/actions`
2. Clique em "New repository secret"
3. Adicione:
   - **Nome:** `NETLIFY_AUTH_TOKEN`
   - **Valor:** (pegue em https://app.netlify.com/user/applications#personal-access-tokens)
4. Adicione outro:
   - **Nome:** `NETLIFY_SITE_ID`
   - **Valor:** (pegue em Site settings → General → Site details → Site ID)

Agora, todo `git push` vai fazer build E deploy automaticamente! 🚀

---

## 🔄 WORKFLOW MANUAL

Se quiser rodar o build manualmente (sem fazer push):

1. Vá em: `https://github.com/SEU-USUARIO/gest-ultrassom/actions`
2. Clique em "Build and Deploy Flutter Web" (no menu lateral)
3. Clique em "Run workflow"
4. Clique em "Run workflow" de novo (confirmação)
5. Aguarde ~5 minutos
6. Baixe o artifact!

---

## 📊 O QUE ACONTECE NO WORKFLOW

```
1. ✅ Checkout do código
2. ✅ Instala Flutter 3.24.5
3. ✅ Verifica versão
4. ✅ flutter pub get (instala dependências)
5. ✅ flutter analyze (verifica código)
6. ✅ flutter build web --release (compila!)
7. ✅ Upload do build/web como artifact
8. ✅ (Opcional) Deploy no Netlify
```

---

## 🎯 VANTAGENS

- ✅ **Não precisa instalar Flutter** no seu Mac
- ✅ **Build roda na nuvem** (GitHub Actions é grátis)
- ✅ **Sempre a versão mais recente** do código
- ✅ **Deploy automático** (se configurar secrets)
- ✅ **Histórico de builds** (pode baixar builds antigos)
- ✅ **CI/CD profissional**

---

## ⚡ PRÓXIMOS PASSOS

1. **Crie o repositório no GitHub** (se ainda não tem)
2. **Faça git push**
3. **Aguarde o build** (~5 min)
4. **Baixe o artifact** ou deixe fazer deploy automático
5. **Teste o site!**

---

## 🐛 TROUBLESHOOTING

### **Build falhou?**
- Veja os logs em: `https://github.com/SEU-USUARIO/gest-ultrassom/actions`
- Clique no workflow com ❌
- Veja qual step falhou

### **Artifact não aparece?**
- Aguarde o workflow completar (ícone ✓ verde)
- Role até o final da página
- A seção "Artifacts" só aparece após sucesso

### **Deploy não funciona?**
- Verifique se configurou os secrets corretamente
- Ou use deploy manual (arrastar pasta no Netlify)

---

## 📧 SUPORTE

Se tiver algum problema:
1. Verifique os logs do GitHub Actions
2. Me envie o link do workflow que falhou
3. Te ajudo a resolver!

---

**🎉 ISSO É DESENVOLVIMENTO PROFISSIONAL!** 🎉

Agora você tem CI/CD completo sem instalar nada! 🚀

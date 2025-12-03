# 🚀 DEPLOY DO GEST ULTRASSOM - NETLIFY

## ✅ CONFIGURAÇÃO COMPLETA!

O projeto está pronto para deploy com:
- ✅ Supabase configurado
- ✅ Credenciais aplicadas
- ✅ Schema do banco criado
- ✅ Storage configurado

---

## 📋 PASSO A PASSO PARA DEPLOY

### **OPÇÃO 1: Deploy Rápido (se você já tem o build)**

Se você já tem a pasta `build/web`, basta fazer upload no Netlify:

1. Acesse https://app.netlify.com
2. Arraste a pasta `build/web` para o Netlify
3. Pronto!

---

### **OPÇÃO 2: Build Completo + Deploy**

Se você precisa fazer o build primeiro:

#### **1. Garantir que o Flutter está instalado**

Abra o terminal e execute:
```bash
flutter --version
```

Se não estiver instalado, baixe em: https://flutter.dev/docs/get-started/install

#### **2. Ir para o diretório do projeto**

```bash
cd "/Users/carlosalbertoraimundobaldo/carteira-pre-natal/Gest ultrassom"
```

#### **3. Instalar dependências**

```bash
flutter pub get
```

#### **4. Fazer o build para Web**

```bash
flutter build web --release
```

Isso vai criar a pasta `build/web` com todos os arquivos prontos para deploy.

#### **5. Deploy no Netlify via CLI**

Se você tem o Netlify CLI instalado:
```bash
netlify deploy --dir=build/web --prod
```

Ou, se não tiver:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir=build/web --prod
```

#### **6. Deploy Manual (sem CLI)**

1. Acesse https://app.netlify.com
2. Clique em "Add new site" > "Deploy manually"
3. Arraste a pasta `build/web` para a área de upload
4. Aguarde o deploy completar
5. Copie a URL gerada (exemplo: https://seu-site.netlify.app)

---

## 🔧 NETLIFY.TOML (Configuração - Opcional)

Se quiser configurações avançadas, crie um arquivo `netlify.toml` na raiz:

```toml
[build]
  publish = "build/web"
  command = "flutter build web --release"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ✅ VERIFICAR SE FUNCIONOU

Depois do deploy, teste:

1. **Abra a URL do Netlify**
2. **Crie uma conta** (nome, DUM/DPP)
3. **Veja se os exames aparecem automaticamente**
4. **Mude o status de um exame** (pendente → agendado)
5. **Marque como realizado**

Se tudo isso funcionar, sucesso! 🎉

---

## 🐛 TROUBLESHOOTING

### **Erro: "Failed to load"**
- Verifique se as credenciais do Supabase estão corretas em `lib/main.dart`

### **Erro 400 ou 401 do Supabase**
- Verifique se as políticas RLS foram criadas
- Confirme que o bucket `exam-attachments` existe

### **Exames não aparecem**
- Vá no Supabase > Table Editor > exames
- Verifique se os registros foram criados ao criar perfil

---

## 🎯 URL ATUAL DO NETLIFY

Você mencionou que já tem deploy em:
**https://melodious-gaufre-b02740.netlify.app**

Para atualizar esse deploy:
1. Configure o Netlify para apontar para este repositório
2. Ou faça deploy manual da pasta `build/web`

---

## 📊 CREDENCIAIS CONFIGURADAS

- **Supabase URL:** `https://bsoehtjnmsrmdppigczs.supabase.co`
- **API Key:** Configurada em `lib/main.dart`

---

**Basta fazer o build e deploy agora!** 🚀

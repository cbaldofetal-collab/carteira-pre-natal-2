# Configuração do Google Auth no Supabase

Para que o botão "Continuar com Google" funcione, você precisa configurar o provedor Google no painel do Supabase.

Siga os passos abaixo:

1.  Acesse o painel do seu projeto no [Supabase](https://supabase.com/dashboard).
2.  Vá em **Authentication** -> **Providers**.
3.  Selecione **Google** e ative-o ("Enable Sign in with Google").
4.  Você precisará de um **Client ID** e um **Client Secret**. Para obtê-los:
    *   Acesse o [Google Cloud Console](https://console.cloud.google.com/).
    *   Crie um novo projeto (ou selecione um existente).
    *   Vá em **APIs & Services** -> **Credentials**.
    *   Clique em **Create Credentials** -> **OAuth client ID**.
    *   Selecione **Web application**.
    *   Em **Authorized redirect URIs**, adicione a URL de callback do Supabase:
        *   Você encontra essa URL no painel do Supabase, na configuração do Google Provider (algo como `https://<seu-projeto>.supabase.co/auth/v1/callback`).
    *   Copie o **Client ID** e **Client Secret** gerados pelo Google.
5.  Cole o **Client ID** e **Client Secret** no painel do Supabase.
6.  Clique em **Save**.

## URL de Redirecionamento (Site URL)

1.  No painel do Supabase, vá em **Authentication** -> **URL Configuration**.
2.  Em **Site URL**, coloque a URL da sua aplicação (ex: `http://localhost:3000` para desenvolvimento ou `https://seu-app.vercel.app` para produção).
3.  Em **Redirect URLs**, adicione:
    *   `http://localhost:3000/auth/callback`
    *   `https://seu-app.vercel.app/auth/callback`

Pronto! Agora o login com Google deve funcionar.

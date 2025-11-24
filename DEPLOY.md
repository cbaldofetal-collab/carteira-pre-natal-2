# Guia de Deploy

Este guia explica como colocar sua Carteira de Pré-Natal online.

## Opção 1: Vercel (Recomendado para Next.js)

A Vercel é a criadora do Next.js e oferece a melhor integração.

### Pré-requisitos
1.  Ter uma conta no [GitHub](https://github.com) (ou GitLab/Bitbucket).
2.  Ter uma conta na [Vercel](https://vercel.com) (pode entrar com o GitHub).

### Passo a Passo

1.  **Subir o código para o GitHub**
    *   Crie um novo repositório no GitHub (ex: `carteira-pre-natal`).
    *   No terminal do seu computador (na pasta do projeto), execute:
        ```bash
        git add .
        git commit -m "Versão inicial para deploy"
        git branch -M main
        git remote add origin https://github.com/SEU_USUARIO/carteira-pre-natal.git
        git push -u origin main
        ```
    *   *(Se der erro de autenticação, você pode usar o GitHub Desktop ou arrastar os arquivos pelo site, mas o terminal é mais rápido se já estiver configurado).*

2.  **Importar na Vercel**
    *   Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
    *   Clique em **"Add New..."** > **"Project"**.
    *   Selecione o repositório `carteira-pre-natal` que você acabou de criar.
    *   Clique em **Import**.

3.  **Configurar Variáveis de Ambiente**
    *   Na tela de configuração ("Configure Project"), procure a seção **Environment Variables**.
    *   Adicione as mesmas variáveis que estão no seu arquivo `.env.local`:
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Copie o valor do seu arquivo)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Copie o valor do seu arquivo)
    *   Clique em **Deploy**.

4.  **Pronto!**
    *   A Vercel vai construir o projeto e te dar um link (ex: `carteira-pre-natal.vercel.app`).
    *   Sempre que você fizer um `git push` com correções, a Vercel atualiza o site automaticamente.

## Opção 2: Netlify (Alternativa)

1.  Suba o código para o GitHub (igual ao passo 1 acima).
2.  Crie uma conta no [Netlify](https://www.netlify.com).
3.  Clique em **"Add new site"** > **"Import an existing project"**.
4.  Conecte com o GitHub e escolha o repositório.
5.  Em **"Build & Deploy"**, o comando de build deve ser `npm run build` e o diretório `out` ou `.next`.
6.  Em **"Environment variables"**, adicione as chaves do Supabase.
7.  Clique em **Deploy**.

## Dúvidas Comuns

*   **Se der erro depois do deploy?**
    *   Você corrige o código no seu computador.
    *   Faz um novo commit (`git commit -am "Correção X"`).
    *   Envia para o GitHub (`git push`).
    *   A Vercel/Netlify detecta a mudança e atualiza o site sozinha em alguns minutos.

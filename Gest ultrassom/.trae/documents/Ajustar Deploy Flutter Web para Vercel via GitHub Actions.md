## Contexto Atual
- Workflow existente em `.github/workflows/deploy_vercel.yml:1` compila e publica com `subosito/flutter-action@v2` e `amondnet/vercel-action@v25`.
- Build é feito em `Gest ultrassom` e o deploy aponta para `Gest ultrassom/build/web`.
- Não há `vercel.json` no repo.

## Objetivo
- Tornar o CI/CD mais confiável, rápido e previsível ao publicar o Flutter Web no Vercel.

## Ajustes Propostos
1. Cache e Pinagem do Flutter
- Ativar cache nativo do `subosito/flutter-action` (`cache: true`) e definir `flutter-version` estável.
- Adicionar `actions/cache` para `~/.pub-cache`, chaveando por `pubspec.lock` de `Gest ultrassom/pubspec.yaml:1` para acelerar `flutter pub get`.

2. Deploy do Build Pré‑compilado
- Garantir que o Vercel use o artefato já gerado: incluir `vercel-args: '--prebuilt --prod'` no passo de deploy.
- Manter `working-directory: Gest ultrassom/build/web` para publicar a saída estática.

3. Configuração de SPA (se necessário)
- Como não há uso de `setUrlStrategy`/rotas sem hash, inicialmente não criar rewrites.
- Se surgirem 404 em subrotas, adicionar `vercel.json` com `framework: "static"` e `rewrites` para `index.html`.

4. Segredos e Segurança
- Confirmar que `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` estão em `Repository Secrets`.
- Opcional: adicionar `github-token: ${{ secrets.GITHUB_TOKEN }}` para melhor integração de status/comentários.

5. Acionadores e Observabilidade
- Acrescentar `workflow_dispatch` para disparo manual.
- Opcional: publicar prévias em `pull_request` (sem `prod: true`), mantendo `--prebuilt`.
- Upload de artefato `build/web` para diagnóstico em caso de falhas.

6. Validação
- Após aplicar, executar em `main` e verificar URL de produção no Vercel.
- Testar navegação, assets e deep links; se houver erro 404 em caminhos, aplicar a etapa 3.

## Entregáveis
- Workflow atualizado em `.github/workflows/deploy_vercel.yml` com cache, `--prebuilt`, acionadores e artefatos.
- (Se necessário) `vercel.json` minimal para SPA.

Confirma que posso aplicar essas mudanças para seguir com a implementação?
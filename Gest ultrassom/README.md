# Gest Ultrassom (Web/Flutter)

## Pré-requisitos
- Flutter SDK instalado
- Projeto Firebase configurado (Web): apiKey, appId, messagingSenderId, projectId, authDomain, storageBucket

## Configuração
- Edite `lib/firebase_options.dart` com os valores do Firebase
- Edite `web/firebase-messaging-sw.js` com os valores do Firebase
- Edite `lib/config.dart` e defina `webVapidKey` e, opcionalmente, `backendBaseUrl`

## Build Web
- `bash scripts/build_web.sh`
- saída: `build/web`

## Deploy (Vercel)
- Deploy estático: `vercel deploy build/web --prod`
- Funções backend (`api/`): precisam estar no repositório raiz. Se usar `vercel deploy` no diretório do projeto raiz, garanta que o build web já foi feito e que o host serve `build/web`.

## Deploy (Firebase Hosting)
- `firebase init hosting` (pasta pública: `build/web`)
- `firebase deploy`

## Testes pós-deploy
- Configurações: atualizar token FCM, enviar ao backend, testar saúde do backend
- Deep link WhatsApp com data preferida
- IG corrigida: alternar base Original/USG e ver DPP na AppBar
- Lembretes próximos e exportação do cronograma


# Deploy Canopy Journal on Railway

1. Create a Railway Postgres plugin and copy `DATABASE_URL`.
2. Set `SESSION_SECRET`, `SESSION_HTTPS_ONLY=true`, and `APP_URL`.
3. Start with `node server.js`.
4. Never commit `.env`.

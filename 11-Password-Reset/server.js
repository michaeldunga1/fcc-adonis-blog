require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./start/routes');
const session = require('express-session');
const { loadUser } = require('./app/middleware/auth');
const { migrate } = require('./app/services/db');
const { seed } = require('./app/services/seed');

async function boot() {
  await migrate();
  await seed();
  const app = express();
  app.use(express.json());
  app.use('/static', express.static(path.join(__dirname, 'public/static')));
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-only-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.SESSION_HTTPS_ONLY === 'true',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }));
  app.use(loadUser);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.use(routes);
  const port = Number(process.env.PORT || 3002);
  app.listen(port, () => {
    console.log(`Canopy Journal listening on http://127.0.0.1:${port}`);
  });
}

boot().catch((err) => {
  console.error(err);
  process.exit(1);
});

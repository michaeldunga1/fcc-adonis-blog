require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./start/routes');
const { migrate } = require('./app/services/db');
const { seed } = require('./app/services/seed');

async function boot() {
  await migrate();
  await seed();
  const app = express();
  app.use(express.json());
  app.use('/static', express.static(path.join(__dirname, 'public/static')));
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

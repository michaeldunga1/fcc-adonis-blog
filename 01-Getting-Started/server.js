require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./start/routes');

async function boot() {
  const app = express();
  app.use(express.json());
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

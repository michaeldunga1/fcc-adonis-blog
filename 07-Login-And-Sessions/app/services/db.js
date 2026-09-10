const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 5 },
});

async function migrate() {
  const hasUsers = await db.schema.hasTable('users');
  if (hasUsers) return;
  await db.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('display_name').notNullable();
    table.text('bio').defaultTo('');
    table.string('image_path');
    table.string('password_hash').notNullable();

  });
  await db.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at', { useTz: true }).defaultTo(db.fn.now());
  });
}

module.exports = { db, migrate };

const User = require('../models/user');
const Post = require('../models/post');
const { db } = require('./db');

async function seed() {
  const count = await db('users').count('* as count').first();
  if (Number(count.count) > 0) return;
  const hash = await User.hashPassword('password123');
  const ada = await User.create({
    username: 'ada',
    email: 'ada@example.com',
    display_name: 'Ada Lovelace',
    bio: 'First programmer',
    image_path: null,
    password_hash: hash, reset_token: null, reset_expires: null,
  });
  const grace = await User.create({
    username: 'grace',
    email: 'grace@example.com',
    display_name: 'Grace Hopper',
    bio: 'Navy admiral',
    image_path: null,
    password_hash: hash, reset_token: null, reset_expires: null,
  });
  const rows = [
    { title: 'Hello from the newsroom', content: 'First post from the teaching seed data.', user_id: ada.id },
    { title: 'Notes on ownership', content: 'Only the author should edit or delete this post.', user_id: ada.id },
    { title: 'Second author voice', content: 'Grace owns this post; Ada should get 403 on mutate.', user_id: grace.id },
  ];
  for (let i = 4; i < 12; i++) {
    rows.push({
      title: `Seed story ${i}`,
      content: `Extra seed content ${i} for pagination.`,
      user_id: i % 2 === 0 ? ada.id : grace.id,
    });
  }
  await db('posts').insert(rows);
}

module.exports = { seed };

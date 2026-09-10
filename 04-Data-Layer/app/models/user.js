const bcrypt = require('bcryptjs');
const { db } = require('../services/db');

class User {
  static table = 'users';

  static query() {
    return db('users');
  }

  static async find(id) {
    return db('users').where({ id }).first();
  }

  static async findByEmail(email) {
    return db('users').where({ email: email.trim().toLowerCase() }).first();
  }

  static async findByUsername(username) {
    return db('users').where({ username }).first();
  }

  static async create(data) {
    const [row] = await db('users').insert(data).returning('*');
    return row;
  }

  static async save(user) {
    const [row] = await db('users').where({ id: user.id }).update(user).returning('*');
    return row;
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }
}

module.exports = User;

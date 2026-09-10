const { db } = require('../services/db');
const User = require('./user');

class PostQuery {
  constructor() {
    this.q = db('posts');
    this._preload = [];
    this._order = null;
    this._limit = null;
    this._offset = null;
    this._search = null;
  }

  preload(relation) {
    this._preload.push(relation);
    return this;
  }

  orderBy(column, direction = 'asc') {
    this._order = [column, direction];
    return this;
  }

  limit(n) {
    this._limit = n;
    return this;
  }

  offset(n) {
    this._offset = n;
    return this;
  }

  whereSearch(q) {
    this._search = q;
    return this;
  }

  async _attachAuthors(rows) {
    for (const row of rows) {
      row.author = await User.find(row.user_id);
    }
    return rows;
  }

  async exec() {
    let q = this.q;
    if (this._search) {
      const term = `%${this._search}%`;
      q = q.where((builder) => {
        builder.whereILike('title', term).orWhereILike('content', term);
      });
    }
    if (this._order) q = q.orderBy(this._order[0], this._order[1]);
    if (this._limit != null) q = q.limit(this._limit);
    if (this._offset != null) q = q.offset(this._offset);
    const rows = await q;
    if (this._preload.includes('author')) return this._attachAuthors(rows);
    return rows;
  }

  then(resolve, reject) {
    this.exec().then(resolve, reject);
  }
}

class Post {
  static query() {
    return new PostQuery();
  }

  static async find(id) {
    const row = await db('posts').where({ id: Number(id) }).first();
    if (!row) return null;
    row.author = await User.find(row.user_id);
    return row;
  }

  static async create(data) {
    const [row] = await db('posts').insert(data).returning('*');
    return row;
  }

  static async save(post) {
    const [row] = await db('posts').where({ id: post.id }).update(post).returning('*');
    return row;
  }

  static async remove(id) {
    return db('posts').where({ id }).del();
  }

  static async countSearch(q) {
    if (!q) return db('posts').count('* as count').first();
    const term = `%${q}%`;
    return db('posts')
      .where((builder) => builder.whereILike('title', term).orWhereILike('content', term))
      .count('* as count')
      .first();
  }
}

module.exports = Post;

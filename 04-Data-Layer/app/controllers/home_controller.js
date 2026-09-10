const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const path = require('path');
const fs = require('fs');
const { renderView } = require('../helpers/view');

class HomeController {
  health(_req, res) {
    return res.json({ ok: true });
  }

  async index(req, res) {
    const rows = await Post.query().preload('author').orderBy('created_at', 'desc');
    const posts = rows.map((p) => ({
      id: undefined,
      title: p.title,
      authorName: p.author.display_name,
      excerpt: p.content.length > 140 ? p.content.slice(0, 140) + '…' : p.content,
    }));
    return renderView(res, req, 'home', { title: 'Latest stories', lead: 'Stories from the canopy desk.', posts });
  }

  about(req, res) {
    return renderView(res, req, 'about', { title: 'About' });
  }
}

module.exports = new HomeController();

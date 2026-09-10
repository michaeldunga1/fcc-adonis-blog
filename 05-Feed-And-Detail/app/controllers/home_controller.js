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
      id: p.id,
      title: p.title,
      authorName: p.author.display_name,
      excerpt: p.content.length > 140 ? p.content.slice(0, 140) + '…' : p.content,
    }));
    return renderView(res, req, 'home', { title: 'Latest stories', lead: 'Stories from the canopy desk.', posts });
  }

  about(req, res) {
    return renderView(res, req, 'about', { title: 'About' });
  }

  async show(req, res) {
    const post = await Post.find(req.params.id);
    if (!post) return res.status(404).send('Not found');
    const canEdit = req.user && req.user.id === post.user_id;
    return renderView(res, req, 'post_detail', {
      title: post.title,
      post: {
        id: post.id,
        title: post.title,
        content: post.content.replace(/\n/g, '<br>'),
        authorName: post.author.display_name,
      },
      canEdit,
    });
  }
}

module.exports = new HomeController();

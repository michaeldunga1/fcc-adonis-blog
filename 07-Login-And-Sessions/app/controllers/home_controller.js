const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const path = require('path');
const fs = require('fs');
const { auth, logout } = require('../services/auth');
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

  registerForm(req, res) {
    return renderView(res, req, 'register', { title: 'Register', error: null });
  }

  async register(req, res) {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (password.length < 8) {
      return renderView(res, req, 'register', { title: 'Register', error: 'Password must be at least 8 characters' });
    }
    const exists = await User.query().where({ username }).orWhere({ email }).first();
    if (exists) {
      return renderView(res, req, 'register', { title: 'Register', error: 'Username or email already taken' });
    }
    const payload = {
      username,
      email,
      display_name: username,
      bio: '',
      image_path: null,
      password_hash: await User.hashPassword(password),
    };
    await User.create(payload);
    return res.redirect('/login');
  }

  loginForm(req, res) {
    return renderView(res, req, 'login', { title: 'Log in', error: null });
  }

  async login(req, res) {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = await User.findByEmail(email);
    if (!user || !(await User.validatePassword(user, password))) {
      return renderView(res, req, 'login', { title: 'Log in', error: 'Invalid credentials' });
    }
    await auth.use('web').login(user, req);
    return res.redirect('/');
  }

  logout(req, res) {
    logout(req);
    return res.redirect('/');
  }
}

module.exports = new HomeController();

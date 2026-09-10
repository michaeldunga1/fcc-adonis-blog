const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const path = require('path');
const fs = require('fs');
const { auth, logout } = require('../services/auth');
const { renderView } = require('../helpers/view');
const multer = require('multer');

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

  profileSelf(req, res) {
    if (!req.user) return res.redirect('/login');
    return res.redirect(`/users/${req.user.username}`);
  }

  async profile(req, res) {
    const profile = await User.findByUsername(req.params.username);
    if (!profile) return res.status(404).send('Not found');
    const posts = await Post.query().whereSearch(null).orderBy('created_at', 'desc');
    const filtered = posts.filter((p) => p.user_id === profile.id);
    return renderView(res, req, 'profile', {
      title: profile.display_name,
      profile: {
        username: profile.username,
        displayName: profile.display_name,
        bio: profile.bio,
        imagePath: profile.image_path,
      },
      posts: filtered.map((p) => ({ id: p.id, title: p.title })),
      isSelf: !!(req.user && req.user.id === profile.id),
    });
  }

  profileEditForm(req, res) {
    if (!req.user) return res.redirect('/login');
    return renderView(res, req, 'profile_edit', {
      title: 'Edit profile',
      profile: {
        displayName: req.user.display_name,
        bio: req.user.bio,
      },
    });
  }

  uploadMiddleware() {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        const dir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`);
      },
    });
    return multer({
      storage,
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          return cb(new Error('Unsupported image type'));
        }
        cb(null, true);
      },
    }).single('image');
  }

  async profileEdit(req, res) {
    if (!req.user) return res.redirect('/login');
    const displayName = String(req.body.displayName || '').trim();
    const bio = String(req.body.bio || '').trim();
    const update = { display_name: displayName, bio };
    if (req.file) update.image_path = `/uploads/${req.file.filename}`;
    req.user = await User.save({ ...req.user, ...update });
    return res.redirect(`/users/${req.user.username}`);
  }

  newForm(req, res) {
    if (!req.user) return res.redirect('/login');
    return renderView(res, req, 'post_form', { title: 'New post', heading: 'New post', error: null, titleValue: '', contentValue: '' });
  }

  async create(req, res) {
    if (!req.user) return res.redirect('/login');
    const title = String(req.body.title || '').trim();
    const content = String(req.body.content || '').trim();
    if (title.length < 3) {
      return renderView(res, req, 'post_form', { title: 'New post', heading: 'New post', error: 'Title too short', titleValue: title, contentValue: content });
    }
    const post = await Post.create({ title, content, user_id: req.user.id });
    return res.redirect(`/posts/${post.id}`);
  }

  async editForm(req, res) {
    const post = await Post.find(req.params.id);
    if (!post) return res.status(404).send('Not found');
    if (!req.user || req.user.id !== post.user_id) return res.status(403).send('Forbidden');
    return renderView(res, req, 'post_form', { title: 'Edit post', heading: 'Edit post', error: null, titleValue: post.title, contentValue: post.content });
  }

  async edit(req, res) {
    const post = await Post.find(req.params.id);
    if (!post) return res.status(404).send('Not found');
    if (!req.user || req.user.id !== post.user_id) return res.status(403).send('Forbidden');
    post.title = String(req.body.title || '').trim();
    post.content = String(req.body.content || '').trim();
    await Post.save({ id: post.id, title: post.title, content: post.content });
    return res.redirect(`/posts/${post.id}`);
  }

  async remove(req, res) {
    const post = await Post.find(req.params.id);
    if (!post) return res.status(404).send('Not found');
    if (!req.user || req.user.id !== post.user_id) return res.status(403).send('Forbidden');
    await Post.remove(post.id);
    return res.redirect('/');
  }
}

module.exports = new HomeController();

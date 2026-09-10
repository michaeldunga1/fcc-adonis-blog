const { renderView } = require('../helpers/view');

class HomeController {
  health(_req, res) {
    return res.json({ ok: true });
  }

  async index(req, res) {
    const SAMPLE = [
      { title: 'Hello from the newsroom', authorName: 'Ada Lovelace', excerpt: 'First post from the teaching seed data.' },
      { title: 'Notes on ownership', authorName: 'Ada Lovelace', excerpt: 'Only the author should edit or delete this post.' },
    ];
    return renderView(res, req, 'home', { title: 'Latest stories', lead: 'Stories from the canopy desk.', posts: SAMPLE });
  }

  about(req, res) {
    return renderView(res, req, 'about', { title: 'About' });
  }
}

module.exports = new HomeController();

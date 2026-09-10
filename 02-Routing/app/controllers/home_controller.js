class HomeController {
  index(_req, res) {
    return res.json({ message: 'Canopy Journal is live' });
  }

  about(_req, res) {
    return res.send('About Canopy Journal');
  }

  health(_req, res) {
    return res.json({ ok: true });
  }
}

module.exports = new HomeController();

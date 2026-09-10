class HomeController {
  index(_req, res) {
    return res.json({ message: 'Canopy Journal is live' });
  }
}

module.exports = new HomeController();

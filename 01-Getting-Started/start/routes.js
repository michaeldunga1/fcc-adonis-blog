const express = require('express');
const HomeController = require('../app/controllers/home_controller');

const router = express.Router();

router.get('/', (req, res) => HomeController.index(req, res));

module.exports = router;

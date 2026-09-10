const express = require('express');
const HomeController = require('../app/controllers/home_controller');

const router = express.Router();

router.get('/', (req, res) => HomeController.index(req, res));
router.get('/about', (req, res) => HomeController.about(req, res));
router.get('/health', (req, res) => HomeController.health(req, res));

module.exports = router;

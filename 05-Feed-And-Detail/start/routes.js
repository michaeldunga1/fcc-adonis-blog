const express = require('express');
const HomeController = require('../app/controllers/home_controller');

const router = express.Router();

router.get('/health', (req, res) => HomeController.health(req, res));
router.get('/', (req, res) => HomeController.index(req, res));
router.get('/about', (req, res) => HomeController.about(req, res));
router.get('/posts/:id', (req, res) => HomeController.show(req, res));

module.exports = router;

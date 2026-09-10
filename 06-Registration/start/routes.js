const express = require('express');
const HomeController = require('../app/controllers/home_controller');

const router = express.Router();

router.get('/health', (req, res) => HomeController.health(req, res));
router.get('/', (req, res) => HomeController.index(req, res));
router.get('/about', (req, res) => HomeController.about(req, res));
router.get('/posts/:id', (req, res) => HomeController.show(req, res));
router.get('/register', (req, res) => HomeController.registerForm(req, res));
router.post('/register', express.urlencoded({ extended: true }), (req, res) => HomeController.register(req, res));

module.exports = router;

const express = require('express');
const HomeController = require('../app/controllers/home_controller');

const router = express.Router();

router.get('/health', (req, res) => HomeController.health(req, res));
router.get('/', (req, res) => HomeController.index(req, res));
router.get('/about', (req, res) => HomeController.about(req, res));
router.get('/posts/:id', (req, res) => HomeController.show(req, res));
router.get('/register', (req, res) => HomeController.registerForm(req, res));
router.post('/register', express.urlencoded({ extended: true }), (req, res) => HomeController.register(req, res));
router.get('/login', (req, res) => HomeController.loginForm(req, res));
router.post('/login', express.urlencoded({ extended: true }), (req, res) => HomeController.login(req, res));
router.get('/logout', (req, res) => HomeController.logout(req, res));
router.get('/profile', (req, res) => HomeController.profileSelf(req, res));
router.get('/users/:username', (req, res) => HomeController.profile(req, res));
router.get('/profile/edit', (req, res) => HomeController.profileEditForm(req, res));
router.post('/profile/edit', express.urlencoded({ extended: true }), HomeController.uploadMiddleware(), (req, res) => HomeController.profileEdit(req, res));

module.exports = router;

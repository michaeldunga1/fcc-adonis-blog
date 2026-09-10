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
router.get('/posts/new', (req, res) => HomeController.newForm(req, res));
router.post('/posts/new', express.urlencoded({ extended: true }), (req, res) => HomeController.create(req, res));
router.get('/posts/:id/edit', (req, res) => HomeController.editForm(req, res));
router.post('/posts/:id/edit', express.urlencoded({ extended: true }), (req, res) => HomeController.edit(req, res));
router.post('/posts/:id/delete', express.urlencoded({ extended: true }), (req, res) => HomeController.remove(req, res));
router.get('/forgot-password', (req, res) => HomeController.forgotForm(req, res));
router.post('/forgot-password', express.urlencoded({ extended: true }), (req, res) => HomeController.forgot(req, res));
router.get('/reset-password/:token', (req, res) => HomeController.resetForm(req, res));
router.post('/reset-password/:token', express.urlencoded({ extended: true }), (req, res) => HomeController.reset(req, res));

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const jwtMiddlaware = require('../middlawares/jwtMiddlaware');

router.get('/database/version', userController.version);
router.post('/createUser', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile', jwtMiddlaware, userController.profileUser);

module.exports = router;
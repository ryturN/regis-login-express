const express = require ('express')
const Controller = require('../controller/auth.js')

const router = express.Router();
 
router.post('/register',Controller.register)

module.exports = router;
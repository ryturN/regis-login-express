const express = require ('express')
const auth = require('../controller/auth.js')

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index')
})
router.get('/register',(req,res)=>{
    res.render('register')
})
router.get('/verify',(req,res)=>{
    res.render('verify')
})

router.post('/register',auth.register)
router.post('/verify',auth.verify)


module.exports =router;
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
router.post('/login', auth.login)

router.get('/home',(req,res)=>{
    const cookie = req.cookies;
    const data = {
        username: cookie['accessToken']
    }
    res.render('home/index',{data});
})
router.get('/dashboard',(req,res)=>{
    const data = {
        admin:true
    };
    res.render('home/dashboard',{data});
})


router.get('/logout',(req,res)=>{
    res.clearCookie('accessToken');
    res.redirect('/')
})

module.exports =router;
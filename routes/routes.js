const express = require ('express')
const auth = require('../controller/auth.js')
const verify = require('../middleware/verifyToken.js')

const router = express.Router();

router.get('/',(req,res)=>{
    const cookie = req.cookies;
    if(!cookie['verifyToken']){
        res.render('index')
    }
    if (cookie['verifyToken']){
        return res.redirect('/home')
    }
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

// router.get('/profile', auth.profile)

router.get('/profile',auth.profile)
router.get('/home',verify.verificationToken,(req,res)=>{
    const user = req.user;
    res.render('home',{user})
})
router.get('/dashboard',(req,res)=>{
    const cookie = req.cookies;
    if(!cookie['verifyToken']){
        return res.redirect('/')
    }
    const data = {
        admin:true
    };
    res.render('home/dashboard',{data});
})


router.get('/logout',(req,res)=>{
    res.clearCookie('verifyToken');
    res.redirect('/')
})

// router.get('/profile',(req,res)=>{
//     const cookie = req.cookies;
//     if(!cookie['verifyToken']){
//         return res.redirect('/')
//     }
// })
module.exports =router;
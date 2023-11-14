const express = require ('express')
const auth = require('../controller/auth.js')
const verify = require('../middleware/verifyToken.js');
const  profile  = require('../controller/profile.js');

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
router.get('/profile/:username?',profile.profileUsers);
router.get('/profile',profile.profiles);

// router.get('/profile', auth.profile)

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
    res.json({
        message: 'See You Later Nerd'})
})

router.get('/*',(req,res)=>{
    res.status(404).json({
        status: 'fail',
        message: 'u got wrong address bro'
    })
})


module.exports =router;
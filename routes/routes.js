const express = require ('express')
const auth = require('../controller/auth.js')
const verify = require('../middleware/verifyToken.js');
const  profile  = require('../controller/profile.js');
const jwt = require('jsonwebtoken')
const {Users,freelancerTable} = require('../models/table.js');
const  resetPassword  = require('../controller/resetPassword.js');
const bcrypt = require('bcrypt')

const router = express.Router();

router.get('/', async (req, res) => {
  const cookie = await req.cookies;
    if (!cookie.verifyToken) {
      return res.render('index');
    }
    const token = cookie.verifyToken;
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.render('index');
      }
      return res.redirect('/home')
    })
  });

  router.get('/home', verify.verificationToken);

router.get('/register',(req,res)=>{
    res.render('register')
})
router.get('/verify',(req,res)=>{
    res.render('verify')
})

router.post('/register',auth.register)
router.post('/verifyUser',auth.verify)
router.post('/login', auth.login)
router.get('/profile/:username?',profile.profileUsers);
router.all('/profile/edit',profile.updateProfile);
router.get('/profile',profile.profiles);
router.post('/forget',resetPassword.forgetPassword);
router.get('/forget',(req,res)=>{
  res.render('forget')
})
router.post('/forget/verify', resetPassword.verifyCode)
router.post('/forget/verify/new', resetPassword.enterNewPassword)


router.get('/dashboard',(req,res)=>{
    const cookie = req.cookies;
    if(!cookie.verifyToken){
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
        status: 'success',
        message: 'See You Later Nerd'})
})

router.get('*',(req,res)=>{
    res.status(404).json({
        status: 'fail',
        message: 'u got wrong address bro'
    })
})


module.exports =router;
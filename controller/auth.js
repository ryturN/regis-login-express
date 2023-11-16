const {LocalStorage} = require('node-localstorage')
const db = require('../dbconfig/index')
localStorage = new LocalStorage('./scratch')
const nodemailer = require('nodemailer')
const {createUser,findUser} = require('../models/createFunc/users')
const {Users, freelancerTable} = require('../models/table')
const {createFreelancer,updateFreelancer,findFreelancer} = require('../models/createFunc/freelancerCreate')
const dotenv= require('dotenv');
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid') 
const { Op } = require('sequelize');

dotenv.config();


exports.login = async(req,res)=>{
  try{
    const {username,email,password,options}=req.body
    const user = await findUser(username,password);
    console.log(user)
    if(user){
      const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
       return res.cookie('verifyToken',token,{
        httpOnly: true,
        maxAge: 24*60*60*1000,
        secure: true
      })
      .status(201).setHeader('Content-Type', 'application/json')
      .json({
        fullName: user.name,
        username: user.username,
        email: user.email,
        role: "consumer",
        point: user.specialPoint,
        level: user.level,
        token: token
      });  
    }
    const freelancer = await findFreelancer(username,password)
      if(freelancer){
        const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
        return res.cookie('verifyToken',token,{
          httpOnly: true,
          maxAge: 24*60*60*1000,
          secure: true  
        })
        .status(201).setHeader('Content-Type', 'application/json') 
        .json({
          fullName: freelancer.name,
          username: freelancer.username,
          email: freelancer.email,
          role : "freelancer",
          EXP: freelancer.experiencePoint,
          level: freelancer.level, 
          token: token
        });  
      }
    res.status(402).json({
      status: 'fail',
      message: 'password / username salah'})
  }catch(error){
    res.status(401).json({
      status: 'fail',
      message: 'User tidak ditemukan!'})
} 


}
exports.verify = async (req,res)=>{
    const {userVerificationCode,email} = req.body
    const dataStorage = JSON.parse(localStorage.getItem('data'));
    const verificationCode = localStorage.getItem('verify')
    const parsedVerificationCode = parseInt(verificationCode);
    const parsedUserVerificationCode = parseInt(userVerificationCode);
    console.log(dataStorage)
    if(email !== dataStorage.email){
      return res.status(402).json({
        status: 'fail',
        message: 'email tidak sama!'
      })
    }
    if(parsedUserVerificationCode === parsedVerificationCode){
      if(dataStorage.options == "consumer"){
        const consumerId = 'consumer_'+nanoid(20)
        console.log(consumerId)
        createUser(
          consumerId,
          dataStorage.fullName,
          dataStorage.username,
          dataStorage.email,
          dataStorage.password,
          )
          res.status(201).send(dataStorage)
        }
      if(dataStorage.options == "freelancer"){
        const freelancer_id = 'freelancer_'+nanoid(20)
        createFreelancer(
          freelancer_id,
          dataStorage.fullName,
          dataStorage.username,
          dataStorage.email,
          dataStorage.password)
          res.status(201).send(dataStorage)
      }
    }else{
     res.json({
      status: 'fail',
      message: 'your verification Code does not match!'})
    }
}


exports.register = async (req,res)=>{
    console.log(req.body);
    const {fullName,username ,email,password,confirmPassword,options}= req.body
    const freelancerData = await freelancerTable.findOne({where: {username}})
    const dataStorage = {
      fullName : req.body.fullName,
      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
      confirmPassword : req.body.confirmPassword,
      options: req.body.options
    };
    const usernameCheck = await Users.findAll({where : {username}})
    const usernameCheckF = await freelancerTable.findAll({where: {username}}) 
    if(options == 'consumer'){
      if (usernameCheck.length > 0) {
        return res.status(401).json({
          status: 'fail',
          message: 'username already taken!'
        });
      }
      const emailCheck= await Users.findAll({where: {email}})
      if(emailCheck.length > 0){
        return res.status(401).json({
          status: 'fail',
          message: 'email already taken!'
        })
      }
    }
    if(options == 'freelancer'){
      if (usernameCheckF.length > 0) {
        return res.status(401).json({
          status: 'fail',
          message: 'username already taken!'
        });
      }
      const emailCheckF= await freelancerTable.findAll({where: {email}})
      if(emailCheckF.length > 0){
        return res.status(401).json({
          status: 'fail',
          message: 'email already taken!'
        })
      }
    }
    if(password !== confirmPassword){
      return res.status(401).send('Password & Confirm Password Tidak Sama!');
    }
      const verificationCode = Math.floor(10000 + Math.random() * 90000);
      localStorage.setItem('data',JSON.stringify(dataStorage));
      localStorage.setItem('verify',verificationCode);
      console.log(verificationCode)
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `watashiox@gmail.com`,
          pass:`xtcvwuvoxccwcong`,
        },
      });
      
      let mailOptions = {
        from: '"LowerMoon" uppermoon1404@gmail.com',
        to: req.body.email,
        subject: "Verification Code",
        text: `Your verification code is ${verificationCode}.`,
        html: `<b>Your verification code is ${verificationCode}.</b>`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.send("Error sending email").code(500);
        }
        console.log("Message sent: %s", info.messageId);
      });
      res.json({
        email : dataStorage.email,
        code : verificationCode,
        role : options
      }); 
    
    
}



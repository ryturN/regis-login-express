const db = require('../dbconfig/index')
const sessionStorage = require('sessionstorage-for-nodejs');
const nodemailer = require('nodemailer')
const {createUser,findUser} = require('../models/createFunc/users')
const {Users, freelancerTable} = require('../models/table')
const {createFreelancer,updateFreelancer,findFreelancer} = require('../models/createFunc/freelancerCreate')
const dotenv= require('dotenv');
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid') 
const { Op } = require('sequelize');
const { createUsersRecord, createFreelanceRecord } = require('../models/createFunc/createRecord');

dotenv.config();


//login 
exports.login = async(req,res)=>{
  try{
    const {username,email,password,options}=req.body
    const user = await findUser(username,password);
    const freelancer = await findFreelancer(username,password)



    //checking if Consumer 
    if(user){
      const getId = user.consumerId
      createUsersRecord(getId)
      const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
       return res.cookie('verifyToken',token,{
        httpOnly: true,
        maxAge: 24*60*60*1000,
        secure: true
      })
      .status(201).setHeader('Content-Type', 'application/json')
      //sending data to FE
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
    //checking if Freelancer
      if(freelancer){

        const getId = freelancer.freelancer_id
        createFreelanceRecord(getId)
        const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
        return res.cookie('verifyToken',token,{
          httpOnly: true,
          maxAge: 24*60*60*1000,
          secure: true  
        })
        .status(201).setHeader('Content-Type', 'application/json') 
        // sending the data to the FE
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
      // if wrong username / password
    res.status(402).json({
      status: 'fail',
      message: 'password / username salah'})
      
  }catch(error){
    res.status(401).json({
      status: 'fail',
      message: error})
} 


//verify is the code same or not
}
exports.verify = async (req,res)=>{
  const {userVerificationCode,email} = req.body
  const cookie = await req.cookies;
    if (!cookie.saveData) {
      return res.json({status: 'fail',message: 'fail'});
    }
    const data = cookie.saveData;
    await jwt.verify(data, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if(err){
      return res.status(404)
      .json({
        status: 'fail',
        message: err
      })
    }
    const dataStorage = decoded.dataStorage
    const verificationCode = decoded.verificationCode
    const parsedVerificationCode = parseInt(verificationCode);
    const parsedUserVerificationCode = parseInt(userVerificationCode);
    if(email !== dataStorage.email){
      return res.status(402).json({
        status: 'fail',
        message: 'email tidak sama!'
      })
    }
    if(parsedUserVerificationCode === parsedVerificationCode){
      if(dataStorage.options == "consumer"){
        const consumerId = 'consumer_'+nanoid(20)
        createUser(
          consumerId,
          dataStorage.fullName,
          dataStorage.username,
          dataStorage.email,
          dataStorage.password,
          )
          return res.status(201).send(dataStorage)
        }
        if(dataStorage.options == "freelancer"){
          const freelancer_id = 'freelancer_'+nanoid(20)
          createFreelancer(
            freelancer_id,
            dataStorage.fullName,
            dataStorage.username,
            dataStorage.email,
            dataStorage.password
            )
            res.status(201).send(dataStorage);

          }
        }else{
          res.json({
            status: 'fail',
            message: 'your verification Code does not match!'})
          }
        })
        }
        
      //register function
      exports.register = async (req,res)=>{
        try{
        const {fullName,username ,email,password,confirmPassword,options}= req.body
        if (typeof fullName === "undefined"){
          return res.status(401).json({
            status: 'fail',
            message: 'must fill all form!',
          })
        }
        const dataStorage = {
          fullName : req.body.fullName,
          username : req.body.username,
          email : req.body.email,
          password : req.body.password,
          confirmPassword : req.body.confirmPassword,
          options: req.body.options
        }; //save what user input into "data storage"
        const verificationCode = Math.floor(10000 + Math.random() * 90000); //for verification code
        const saveData = await jwt.sign({ dataStorage,verificationCode }, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '5m'}); //save data storage and verification code into jwt with name "save data"
        res.cookie('saveData',saveData,{
        httpOnly: true,
        maxAge: 300000,
        secure: true  
      })
    const usernameCheck = await Users.findAll({where : {username}}) //checking username Users
    const usernameCheckF = await freelancerTable.findAll({where: {username}}) //checking username Freelancer
    const emailCheck= await Users.findAll({where: {email}}) //then if username is not taken , then checking email if already taken then status fail
    const emailCheckF= await freelancerTable.findAll({where: {email}})
    if(options == 'consumer'){ //if options "consumer"
      if (usernameCheck.length > 0 || usernameCheckF.length) { //checking username if already taken then status fail
        return res.status(401).json({
          status: 'fail',
          message: 'username already taken!' 
        });
      }
      if(emailCheck.length > 0 || emailCheckF.length > 0){
        return res.status(401).json({
          status: 'fail',
          message: 'email already taken!'
        })
      }
    }
    if(options == 'freelancer'){ //if option "consumer"
      if (usernameCheckF.length > 0 || usernameCheck.length > 0) { //checking username if already taken then status fail
        return res.status(401).json({ 
          status: 'fail',
          message: 'username already taken!'
        });
      }
 //if username is not taken , then checking email is already taken or not , if taken then status fail
    if(emailCheckF.length > 0 || emailCheck.length > 0){
        return res.status(401).json({
          status: 'fail',
          message: 'email already taken!'
        })
      }
    }
    if(password !== confirmPassword){ //if username & email is already checking and both not taken , then checking password user and confirm passowrd is match or not , if not then status fail 
      return res.status(401).send('Password & Confirm Password Tidak Sama!');
    }

      // sending to mailOptions Function
      transporter.sendMail(await mailOptions(email,username,verificationCode),  (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.send("Error sending email").code(500);
        }
        return console.log("Message sent: %s", info.messageId);
      });

      res.status(202).json({
        status: 'success',
        username: username,
        code : verificationCode,
        role: options,
        token: saveData



      
      }); 
}catch(err){
  res.status(505).json({
    status: 'fail',
    message: err
  })
}
}



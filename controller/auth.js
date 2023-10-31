const {LocalStorage} = require('node-localstorage')
const db = require('../dbconfig/index')
localStorage = new LocalStorage('./scratch')
const nodemailer = require('nodemailer')
const {createUser,Users,findUser} = require('../models/users')
const dotenv= require('dotenv');
const jwt = require('jsonwebtoken')

dotenv.config();


exports.login = async(req,res)=>{
  try{
    
    const {username ,password}=req.body
    const user = await findUser(username,password);
    if(user){
      const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
      return res.cookie('verifyToken',token,{
        httpOnly: true,
        maxAge: 24*60*60*1000,
        secure: true
        })
        .status(201).redirect("/home"); 
    }
    return res.status(402).send('password / username salah')
  }catch(error){
    res.status(401).send('User tidak ditemukan!')
} 
}
exports.register = async (req,res)=>{
    const {userVerificationCode} = req.body
    const dataStorage = JSON.parse(localStorage.getItem('data'));
    const verificationCode = localStorage.getItem('verify')
    const parsedVerificationCode = parseInt(verificationCode);
    const parsedUserVerificationCode = parseInt(userVerificationCode);
    console.log(dataStorage)
    if(parsedUserVerificationCode === parsedVerificationCode){
        createUser(dataStorage.name,
            dataStorage.username,
            dataStorage.email,
            dataStorage.password)
    return res.status(201).send('User Register!').render('/')
    }else{
        return res.send('<h1>your verification Code does not match!')
    }
}


exports.verify = async (req,res)=>{
    console.log(req.body);
    const {name, username , email,password,confirmPassword}= req.body
    const dataStorage = {
        name : req.body.name,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword
    };
    const findEmail = await Users.findOne({where : {email}})
    console.log(findEmail)
    console.log(email)
      if(dataStorage.email === Users.findOne({where: {email}})){
        return res.status(401).send('email already taken!')
      }
    if(dataStorage.password !== dataStorage.confirmPassword){
      return res.status(401).send('Password & Confirm Password Tidak Sama!');
    }
    const verificationCode = Math.floor(10000 + Math.random() * 90000);
    localStorage.setItem('data',JSON.stringify(dataStorage));
    localStorage.setItem('verify',JSON.stringify(verificationCode));
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
      return res.render("verify.ejs"); 
}



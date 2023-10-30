const {LocalStorage} = require('node-localstorage')
const db = require('../dbconfig/index')
localStorage = new LocalStorage('./scratch')
const nodemailer = require('nodemailer')
const User = require('../models/users')
const dotenv= require('dotenv');

dotenv.config();


exports.register = async (req,res)=>{
    const {userVerificationCode} = req.body
    const dataStorage = JSON.parse(localStorage.getItem('data'));
    const verificationCode = localStorage.getItem('verify')
    const parsedVerificationCode = parseInt(verificationCode);
    const parsedUserVerificationCode = parseInt(userVerificationCode);
    if(parsedUserVerificationCode === parsedVerificationCode){
        User.createUser(dataStorage.name,
            dataStorage.username,
            dataStorage.email,
            dataStorage.password)

    }else{
        return res.send('<h1>your verification Code does not match!')
    }
}


exports.verify =  (req,res)=>{
    console.log(req.body);
    
    const dataStorage = {
        name : req.body.name,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    };
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

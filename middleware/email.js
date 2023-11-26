const nodemailer = require('nodemailer');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile)

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `watashiox@gmail.com`,
      pass:`xtcvwuvoxccwcong`,
    },
  });

const mailOptions = async(email,username,verificationCode)=>{
    return{
        from: '"LowerMoon" uppermoon1404@gmail.com',
        to: email,
        subject: "Verification Code",
        text: `Your verification code is : ${verificationCode}`,
        html: `
        <hr>
        <h1 style: "text-align: center;"> Soft Skill</h1>
        <hr>
        <br>
        <br>Hai ${username}<br>
        <br><b>Your Verification code is ${verificationCode}<b></br>
        <br>
        <br>
        <hr>
        <br><a>Please don't reply to this email</a></footer>
        `,
    };
}

module.exports = {mailOptions,transporter}
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
const bcrypt = require('bcrypt')
dotenv.config();

exports.forgetPassword = async (req, res) => {
  try{
    const email = req.body.email;
    const emailFreelancer = await freelancerTable.findOne({ where: { email } });
    const emailConsumer = await Users.findOne({ where: { email } });
    const verificationCode = Math.floor(10000 + Math.random() * 90000);
    const emailToken = jwt.sign({ email,verificationCode }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    res.cookie('emailToken', emailToken, {
        httpOnly: true,
        maxAge: 300000,
        secure: true,
    });

    // if email not exist!
    if(!emailFreelancer && !emailConsumer){
        return res.status(402).json({
            status : 'fail',
            message: 'user tidak ditemukan'
        })
    }

// if exist 
    let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `watashiox@gmail.com`,
                pass: `xtcvwuvoxccwcong`,
            },
        });

// if email are for Freelancer
        if(emailFreelancer){

            let mailOptions = {
                from: '"LowerMoon" uppermoon1404@gmail.com',
                to: emailFreelancer.email,
                subject: "Verification Code",
                text: `Your verification code is ${verificationCode}.`,
                html: `<b>Your verification code is ${verificationCode}.</b>`,
            };
            
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).send("Error sending email");
                }
                console.log("Message sent: %s", info.messageId);
                
                return res.json({
                    email: emailFreelancer.email,
                    code: verificationCode,
                    role: 'freelancer'
                });
            });
        }

// if email are for Consumer
        if(emailConsumer){
            
            let mailOptions = {
                from: '"LowerMoon" uppermoon1404@gmail.com',
                to: emailConsumer.email,
                subject: "Verification Code",
                text: `Your verification code is ${verificationCode}.`,
                html: `<b>Your verification code is ${verificationCode}.</b>`,
            };
            
            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).send("Error sending email");
                }
                console.log("Message sent: %s", info.messageId);
                
                return res.json({
                    email: emailConsumer.email,
                    code: verificationCode,
                    role: 'consumer'
                });
            });
            
        }
        
        
    }catch(error){
        res.status(505).json({
            status: 'fail',
            message: error})
        } 
    };
    
    // verif Code
    exports.verifyCode = async(req,res)=>{
    try{
        const userVerifCode = req.body.userVerifCode
        const cookie = req.cookies
        if (!cookie.emailToken) {
            return res.status(402)
            .json('unauthorized');
        }
        const emailToken = cookie.emailToken
        await jwt.verify(emailToken,process.env.ACCESS_TOKEN_SECRET,async(err,decoded)=>{
            if(err){
                return res.json({
                    status:'fail',
                    message: err
                })
            }
            const verifCode = decoded.verificationCode
            console.log(verifCode)
            if(userVerifCode == verifCode){
                return res.status(202).json({
                    status: 'success',
                    message: 'verif success'
                })
            }
            // checking code
            if(userVerifCode !== verifCode){
                return res.status(404).json({
                    status: 'fail',
                    message: 'verif code tidak sama!'
                })
            }
        })
    }catch(err){
        res.status(505).json({
            status:'fail',
            message: err
        })
    }
}

 exports.enterNewPassword = async(req,res)=>{
    const {password,confirmNewPassword} =req.body
    const cookie = req.cookies

    if(!cookie.emailToken){
        return res.status(404)
        .json({
            status: 'fail',
            message: 'unauthorized!'
        })
    }
    const emailToken = cookie.emailToken
    await jwt.verify(emailToken,process.env.ACCESS_TOKEN_SECRET, async(err,decoded)=>{
        if(err){
            req.status(500).json({
                status: 'fail',
                message: err
            })
        }
            const email = decoded.email
            const findConsumerEmail = await Users.findOne({where: {email} })
            const findFreelancerEmail = await freelancerTable.findOne({where: {email} })
        if(findConsumerEmail){
            const hashedPassword = await bcrypt.hashSync(password,10)
            findConsumerEmail.update({password:hashedPassword});
            res.status(202)
            .json({
                status: 'success',
            })
            }
        
        if(findFreelancerEmail){
            const hashedPassword = await bcrypt.hashSync(password,10)
            findFreelancerEmail.update({password: hashedPassword})
            res.status(202)
            .json({
                status: 'success',
            })
        }
        if(password !== confirmNewPassword){
            res.status(402).json({
                status: 'fail',
                message: 'password - confirm password tidak sama!'
            })
        }
    })

}



const {LocalStorage} = require('node-localstorage')
const db = require('../dbconfig/index')
localStorage = new LocalStorage('./scratch')
const {Users, freelancerTable}= require('../models/table')
const {createUser,findUser,updateUser} = require('../models/createFunc/users')
const {createFreelancer,updateFreelancer,findFreelancer} = require('../models/createFunc/freelancerCreate')
const auth = require('./auth')


exports.profileUsers = async(req,res)=>{
  const { username } = req.params;
  const cookie = req.cookies;
  try {
    const user = await Users.findOne({ where: { username } }) 
    const freelancer = await freelancerTable.findOne({where: {username}});
    
      if (!cookie['verifyToken']) {
         res.status(401).json({
           status: 'fail',
           message: 'Unauthorized!' });
      }
      if(user){
       return res.status(200).json({
          name: user.fullName,
          username: user.username,
          email: user.email,
          specialPoint : user.specialPoint,
          level: user.level,
          role: 'consumer'
        });
      }
      if(freelancer){
      return res.status(200).json({
          name : freelancer.fullName,
          username: freelancer.username,
          email: freelancer.email,
          EXP: freelancer.experiencePoint,
          level: freelancer.level,
          role: 'freelancer'
        });
      }
      if(!user || !freelancer){
       return res.status(404).json({ message: 'User tidak ditemukan!' });
      }
    } catch (error) {
      console.error(error); 
      res.status(500).json({ 
        status: 'fail',
        message: 'Internal server error' });
    }
  };
  
exports.profiles = async(req,res)=>{
  const cookie = req.cookies;
  try{
    if(auth.login){
    const user = await Users.findOne({where: {username}});
      res.status(200).json({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    }
  }catch(error){
    console.log(error);
    res.status(500).json({message: 'Internal server error'})
  }
}


exports.updateProfile = async(req,res)=>{
  const {name,username,email,password} = req.body;
  
}
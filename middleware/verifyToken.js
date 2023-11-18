const jwt = require('jsonwebtoken');
const {Users,freelancerTable} = require('../models/table.js');


exports.verificationToken = async (req, res) => {
  const cookie = await req.cookies;
  

    if (!cookie.verifyToken) {

      return res.render('index');
    }
    const token = cookie.verifyToken;
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.render('index');
      }
      const username = decoded.username
      const userConsumer = await Users.findOne({where: {username}})
      const userFreelancer = await freelancerTable.findOne({where: {username}})
      if(userConsumer){
        res.json({
              name : userConsumer.fullName,
              username: userConsumer.username,
              email: userConsumer.email,
              role: 'consumer'
            });
        }
        if(userFreelancer){
            res.json({
                name: userFreelancer.fullName,
                username: userFreelancer.username,
                email: userFreelancer.email,
                role: 'freelancer'
            })
        }
    });
};
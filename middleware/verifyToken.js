const jwt = require('jsonwebtoken')




exports.verificationToken= (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token =authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err) return res.sendStatus(403);
        req.user = user
        next()
    })
}

// exports.verificationToken= (req,res,next)=>{
//     const token = req.cookies.token;
//     try{
//         const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = user;
//     }catch(error){
//         res.clearCookie("token")
//         return res.redirect("/")
//     }
// }

const { getSingleUser } = require("../database")
const validator=require('validator')
const jwt=require('jsonwebtoken')

const auth=async(req,res,next)=>{
   const token=req.cookies.Token;
   console.log(token);
   
   if(!token){
    return res.status(400).json({msg:'Unauthorized, missing token'})
   }

   jwt.verify(token,'the jwt auth',(err,user)=>{
    if(err){
        return res.status(400).json({msg:'Unauthorized invalid token!'})
    }
    req.user=user;
    next();
   })
    
}

module.exports={
    auth
}
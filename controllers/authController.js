const validator=require('validator');
const jwt=require('jsonwebtoken');
const { insertData, getSingleUser } = require('../database');
const { auth } = require('../middleware/auth');
const bcrypt=require('bcrypt')

const jsonWebToken=async(user)=>{
    console.log(user[0]);
    //creating payload
    const payload={
        id:user[0].id,
        username:user[0].username,
        email:user[0].email
    }
    console.log(payload);
    const token=jwt.sign(payload,'the jwt auth',{expiresIn:'3d'});
    return token;
}

//signup
const getSignup = async (req, res) => {
res.status(200).render('signup')
}

const postSignup = async (req,res) => {
const {name,email,password}=req.body;
try {
    if(!name){
        throw Error("Enter a valid name")
    }
    //email validation
    if(!validator.isEmail(email)){
        throw Error("Enter a valid email")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Enter a strong password")
    }
    //inserting into database
   const user=await insertData(name,email,password)
   if(user){
    //jwt 
    const token=await jsonWebToken(user);
    res.cookie('Token',token,{maxAge:1000*60*60,httpOnly:true}).status(300).redirect('/');
   }else{
    return res.status(400).json({msg:"user not created"})
   }
} catch (error) {
    console.log(error.message);
    res.status(400).json({msg:error.message})
}

}

//login
const getLogin = async (req, res) => {
    res.status(200).render('login')
}


const postLogin = async (req, res) => {
    const {email,password}=req.body;
  try {
        //email validation
    if(!validator.isEmail(email)){
      throw Error("Enter a valid email")
    }
    //checking if the user exist or not
    const user=await getSingleUser('',email);
        if(user){
            //checking user
            const evaluatePassword=await bcrypt.compare(password,user[0].password_hash);
            if(!evaluatePassword){
                throw Error("Enter an correct password!")
            }
            const token=await jsonWebToken(user);
            res.cookie('Token',token,{maxAge:1000*60*60,httpOnly:true}).status(200).redirect('/');
        } 
  } catch (error) {
    res.status(400).json({msg:error.message})
  }
}

module.exports = {
    getSignup, getLogin, postSignup, postLogin
}
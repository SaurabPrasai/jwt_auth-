const mysql=require('mysql2');
require('dotenv').config();
const bcrypt=require('bcrypt');
const { get } = require('./routes/authRoutes');

const pool=mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USERNAME,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise();

pool.getConnection((err,connection)=>{
    if(err){
        console.log(err);
        return console.log("Error occured");
    }
    console.log('Database connected!');
    pool.end();
})

//getting a row
const getSingleUser=async(username,email)=>{
    try {
        const user=await pool.query(`select * from users where username=? or email=?`,[username,email])
        return user[0];
    } catch (error) {
        console.log(error.message);
    }
}

//creating new users
const insertData=async(name,email,password)=>{
    try {
         const salt=await bcrypt.genSalt();
         const password_hash=await bcrypt.hash(password,salt);
         await pool.query(`insert into users(username,email,password_hash) values (?,?,?)`,[name,email,password_hash])
        return getSingleUser(name,email);
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    insertData,getSingleUser
}


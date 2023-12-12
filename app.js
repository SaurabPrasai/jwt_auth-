const express=require('express');
const app=express();
const port=3000;
const authRouter=require('./routes/authRoutes')
const cookieParser=require('cookie-parser');
const { auth } = require('./middleware/auth');


//middleware
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cookieParser());
app.use(authRouter)

//view engine
app.set('view engine','ejs');



app.get('/',auth,(req,res)=>{
    res.status(200).render('home')
})
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})
const { getLogin, postSignup, getSignup, postLogin } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router=require('express').Router();


//signup 
router.get('/api/signup',getSignup)

router.post('/api/signup',postSignup)

//login 
router.get('/api/login',getLogin)

router.post('/api/login',postLogin)

module.exports=router;



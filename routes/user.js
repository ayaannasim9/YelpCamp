const express=require('express');
const router=express.Router();
const asyncWrapper=require('../utils/AsyncWrapper');
const User=require('../models/user');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',asyncWrapper(async(req,res)=>{
    // res.send(req.body);
    const {username,password,email}=req.body;
    const user=new User({
        username,
        email,
    })
    const registerdUser=await User.register(user,password);
    req.login(registerdUser,(err)=>{
        if(err) return next(err)
        req.flash('success','welcome to yelpcamp');
        res.redirect('/campgrounds');
    })
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back');
    res.redirect('/campgrounds');
})

router.get('/logout',(req,res)=>{
    req.logOut(function(err){
        if(err){
            return next(err)
        }
    });
    req.flash('success','logged out');
    res.redirect('/campgrounds');
})

module.exports=router;
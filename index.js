const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const Campgrounds=require('./models/campground');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const asyncWrapper=require('./utils/AsyncWrapper')
const ExpressError=require('./utils/ExpressError');
const Joi=require('joi');
const {campgroundSchema,reviewSchema}=require('./schemas');
const Review = require('./models/review');
const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/user');
const session = require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localStratergy=require('passport-local');
const User=require('./models/user');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log('connected to mongo db');
})

const app=express();
const port=3000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);      // “Whenever you render an .ejs file, don’t use the default EJS renderer—use ejs-mate instead.”
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig={
    secret:'thisshouldbebetter',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


app.get('/',(req,res)=>{
    res.send('Hello from yelpcamp')
})


app.all(/(.*)/,(req,res,next)=>{                        //app.all() matches all HTTP verbs
    // res.send('404 not found');
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{
    const {status=500}=err;
    if(!err.message) err.message='Something went wrong';
    res.status(status).render('error',{err});
    // res.send('something went wrong. We will be working on it');
})

app.listen(port,()=>{
    console.log('serving on port',port);
})
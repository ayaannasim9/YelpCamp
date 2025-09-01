const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const Campgrounds=require('./models/campground')
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const asyncWrapper=require('./utils/AsyncWrapper')
const ExpressError=require('./utils/ExpressError');
const Joi=require('joi');
const {campgroundSchema,reviewSchema}=require('./schemas')
const Review = require('./models/review');


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

const validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=>e.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=>e.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

app.get('/',(req,res)=>{
    res.send('Hello from yelpcamp')
})

app.get('/campgrounds',asyncWrapper(async (req,res,next)=>{
    const campgrounds=await Campgrounds.find({});
    res.render('campground/index',{campgrounds});
}))

app.post('/campgrounds',validateCampground,asyncWrapper(async (req,res,next)=>{
    const camp=new Campgrounds(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.get('/campgrounds/new',(req,res)=>{
    res.render('campground/new');
})

app.get('/campgrounds/:id',asyncWrapper(async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campgrounds.findById(id).populate('reviews');
    res.render('campground/show',{campground})
}))

app.patch('/campgrounds/:id',validateCampground,asyncWrapper(async (req,res,next)=>{
    const {title,location, image, price, description}=req.body.campground;
    const p=parseInt(price);
    const updatedCamp=await Campgrounds.findByIdAndUpdate(req.params.id,{
        title,
        location,
        price:p,
        description,
        image
    },{new:true});
    res.redirect(`/campgrounds/${updatedCamp._id}`);
}))

app.delete('/campgrounds/:id',asyncWrapper(async (req,res,next)=>{
    await Campgrounds.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

app.get('/campgrounds/:id/edit',asyncWrapper(async (req,res,next)=>{
    const campground=await Campgrounds.findById(req.params.id);
    res.render('campground/edit',{campground});
}))

app.post('/campgrounds/:id/reviews',validateReview,asyncWrapper(async(req,res,next)=>{
    const campground=await Campgrounds.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId',asyncWrapper(async (req,res,next)=>{
    // res.send('delte me!');
    const {id,reviewId}=req.params;
    await Campgrounds.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all(/(.*)/,(req,res,next)=>{
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
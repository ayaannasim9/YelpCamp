const express=require('express');
const router=express.Router({mergeParams:true});    //gives us access to the root params, from index.js
const Campgrounds=require('../models/campground');
const Review = require('../models/review');
const {campgroundSchema,reviewSchema}=require('../schemas');
const ExpressError=require('../utils/ExpressError');
const asyncWrapper=require('../utils/AsyncWrapper');
const isLoggedIn=require('../middleware');



const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=>e.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

router.post('/',validateReview,asyncWrapper(async(req,res,next)=>{
    const campground=await Campgrounds.findById(req.params.id);
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId',asyncWrapper(async (req,res,next)=>{
    // res.send('delte me!');
    const {id,reviewId}=req.params;
    await Campgrounds.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','deleted review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;
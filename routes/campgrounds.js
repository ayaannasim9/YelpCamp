const express=require('express');
const router=express.Router();
const Campgrounds=require('../models/campground');
const asyncWrapper=require('../utils/AsyncWrapper');
const ExpressError=require('../utils/ExpressError');
const {campgroundSchema,reviewSchema}=require('../schemas')
const isLoggedIn=require('../middleware');

const validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=>e.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

router.get('/',asyncWrapper(async (req,res,next)=>{
    const campgrounds=await Campgrounds.find({});
    res.render('campground/index',{campgrounds});
}))

router.post('/',isLoggedIn,validateCampground,asyncWrapper(async (req,res,next)=>{
    const camp=new Campgrounds(req.body.campground);
    await camp.save();
    req.flash('success','successfully made a new campground');
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campground/new');
})

router.get('/:id',asyncWrapper(async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campgrounds.findById(id).populate('reviews');
    if(!campground){
        req.flash('error','cant find campground');
        return res.redirect('/campgrounds');
    }
    res.render('campground/show',{campground})
}))

router.patch('/:id',isLoggedIn,validateCampground,asyncWrapper(async (req,res,next)=>{
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

router.delete('/:id',isLoggedIn,asyncWrapper(async (req,res,next)=>{
    await Campgrounds.findByIdAndDelete(req.params.id);
    req.flash('success','deleted campground');
    res.redirect('/campgrounds');
}));

router.get('/:id/edit',isLoggedIn,asyncWrapper(async (req,res,next)=>{
    const campground=await Campgrounds.findById(req.params.id);
    if(!campground){
        req.flash('error','cant find campground');
        res.redirect('/campgrounds');
    }
    res.render('campground/edit',{campground});
}))

module.exports=router;
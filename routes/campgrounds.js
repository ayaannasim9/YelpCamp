const express=require('express');
const router=express.Router();
const Campgrounds=require('../models/campground');
const asyncWrapper=require('../utils/AsyncWrapper');
const ExpressError=require('../utils/ExpressError');
const {campgroundSchema,reviewSchema}=require('../schemas')

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

router.post('/',validateCampground,asyncWrapper(async (req,res,next)=>{
    const camp=new Campgrounds(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.get('/new',(req,res)=>{
    res.render('campground/new');
})

router.get('/:id',asyncWrapper(async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campgrounds.findById(id).populate('reviews');
    res.render('campground/show',{campground})
}))

router.patch('/:id',validateCampground,asyncWrapper(async (req,res,next)=>{
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

router.delete('/:id',asyncWrapper(async (req,res,next)=>{
    await Campgrounds.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));

router.get('/:id/edit',asyncWrapper(async (req,res,next)=>{
    const campground=await Campgrounds.findById(req.params.id);
    res.render('campground/edit',{campground});
}))

module.exports=router;
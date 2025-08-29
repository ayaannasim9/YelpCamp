const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const Campgrounds=require('./models/campground')
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const asyncWrapper=require('./utils/AsyncWrapper')
const ExpressError=require('./utils/ExpressError');
const Joi=require('joi');

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

app.get('/',(req,res)=>{
    res.send('Hello from yelpcamp')
})

app.get('/campgrounds',asyncWrapper(async (req,res,next)=>{
    const campgrounds=await Campgrounds.find({});
    res.render('campground/index',{campgrounds});
}))

app.post('/campgrounds',asyncWrapper(async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Empty Data',400);
    const campgroundSchema=Joi.object({
        camground:Joi.object({
            title:Joi.string().required(),
            image:Joi.string(),
            price:Joi.number().min(0).required(),
            description:Joi.string().required(),
            location:Joi.string().required(),
        }).required()
    })

    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(e=>e.message).join(',');
        throw new ExpressError(msg,400);
    }
    const camp=new Campgrounds(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.get('/campgrounds/new',(req,res)=>{
    res.render('campground/new');
})

app.get('/campgrounds/:id',asyncWrapper(async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campgrounds.findById(id);
    res.render('campground/show',{campground})
}))

app.patch('/campgrounds/:id',asyncWrapper(async (req,res,next)=>{
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
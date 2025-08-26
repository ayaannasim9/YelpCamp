const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const Campgrounds=require('./models/campground')
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');

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

app.get('/campgrounds',async (req,res)=>{
    const campgrounds=await Campgrounds.find({});
    res.render('campground/index',{campgrounds});
})

app.post('/campgrounds',async (req,res)=>{
    const camp=new Campgrounds(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campground/new');
})

app.get('/campgrounds/:id',async (req,res)=>{
    const {id}=req.params;
    const camp=await Campgrounds.findById(id);
    res.render('campground/show',{camp})
})

app.patch('/campgrounds/:id',async (req,res)=>{
    const {title,location}=req.body.campground;
    const updatedCamp=await Campgrounds.findByIdAndUpdate(req.params.id,{
        title,
        location
    },{new:true});
    res.redirect(`/campgrounds/${updatedCamp._id}`);
})

app.delete('/campgrounds/:id',async (req,res)=>{
    await Campgrounds.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
    const camp=await Campgrounds.findById(req.params.id);
    res.render('campground/edit',{camp});
})

app.listen(port,()=>{
    console.log('serving on port',port);
})
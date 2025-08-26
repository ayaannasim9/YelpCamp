const mongoose=require('mongoose');
const cities=require('./cities');
const {descriptors,places}=require('./seedHelpers');
const Campground=require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log('connected to mongo db');
})


const sample=(arr)=>{
    return arr[Math.floor(Math.random()*arr.length)];
}
async function seedDB(){
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        let randomNumber=Math.floor(Math.random()*1000);
        const camp=new Campground({
            location:`${cities[randomNumber].city}, ${cities[randomNumber].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
        })
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})
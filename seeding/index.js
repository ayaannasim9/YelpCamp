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
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            location:`${cities[randomNumber].city}, ${cities[randomNumber].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:`https://picsum.photos/400?random=${Math.random()}`,
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam sit illo eos expedita. Dolorem rerum dignissimos consequatur fugit omnis doloremque officia cupiditate dolorum possimus. Nihil explicabo deleniti ea suscipit assumenda.',
            price:price
        })
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})
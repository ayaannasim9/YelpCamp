const mongoose=require('mongoose');
const review = require('./review');
const Schema=mongoose.Schema;

const Campgroundschema=new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review',
        }
    ]
})

Campgroundschema.post('findOneAndDelete',async function (campground){
    if(campground){
        await review.deleteMany({
            _id:{$in:campground.reviews}
        })
    }
})

module.exports=mongoose.model('Campground',Campgroundschema);
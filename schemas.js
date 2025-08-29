const Joi=require('joi');
module.exports.campgroundSchema=Joi.object({
        campground:Joi.object({
            title:Joi.string().required(),
            image:Joi.string().allow(''),
            price:Joi.number().min(0).required(),
            description:Joi.string().required(),
            location:Joi.string().required(),
        }).required()
    })
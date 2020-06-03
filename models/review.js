const mongoose = require('mongoose'); 

const reviewSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true
    }, 
    ownerId: {
        type: String, 
        required: true
    }, 
    ownerUsername: {
        type: String, 
        required: true, 
        trim: true
    }, 
    titlePost: {
        type: String, 
        required: true, 
        trim: true
    }, 
    review: {
        type: String, 
        required: true, 
        trim: true, 
        maxlength: 500
    }, 
    rating: {
        type: Number, 
        required: true, 
        min: 1, 
        max: 10
    }
},{timestamps: true}); 

const UserReview = mongoose.model('UserReview',reviewSchema); 

module.exports = {UserReview}
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const config = require('./../server/config/config').get(process.env.NODE_ENV);  
const SALT = 10; 

const userSchema = mongoose.Schema({
    username : {
        type : String, 
        required : true, 
        unique : 1,
        maxlength : 100
    }, 
    firstname : {
        type : String, 
        required : true, 
        trim : true
    },
    lastname : {
        type : String, 
        required : true, 
        trim : true
    }, 
    email : {
        type : String, 
        required : true, 
        unique : 1, 
        trim : true
    },
    password : {
        type : String, 
        required : true, 
        minlength : 8
    }, 
    role : {
        type : Number, 
        default : 2,
    }, 
    token : {
        type : String
    }
}); 

userSchema.pre('save', function (next) {
    var user = this; 

    if (user.isModified('password')){
        bcrypt.genSalt(SALT, function(err,salt) {
            if (err) return err; 
            bcrypt.hash(user.password,salt, function (err,hash) {
                if(err) return next(err); 
                user.password = hash; 
                next(); 
            }); 
        }); 
    }
    else{
        next(); 
    }
}); 

userSchema.statics.findByToken = function(token, cb){
    var user = this; 

    jwt.verify(token, config.SECRET, (err, decode) => {
        user.findOne({'_id': decode, 'token': token}, (err,user) => {
            if(err) return cb(err); 
            cb(null,user); 
        }); 
    }); 
}

userSchema.methods.generateToken = function (cb){
    var user = this; 
    var token = jwt.sign(user._id.toHexString(), config.SECRET); 

    user.token = token; 
    user.save( (err,user) => {
        if (err) return cb(err); 

        cb(null, user); 
    })
}

userSchema.methods.comparePasswords = function(candidatePassword,cb) {
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return cb(err); 
        cb(null,isMatch); 
    })
}

userSchema.methods.deleteToken = function(token, cb){
    const user = this; 

    user.update({$unset: {token : 1}}, (err,user) => {
        if(err) return cb(err); 
        cb(null,user); 
    })
}


const User = mongoose.model('User', userSchema); 

module.exports = {User}; 
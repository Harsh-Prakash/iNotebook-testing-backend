const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema=new Schema({
    name:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    password:{
        type:String,
        // required:true
        /*required: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
        validate: [validatePresenceOf, 'Email cannot be blank']*/
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const User = mongoose.model('user',UserSchema)
module.exports=User
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const brcypt= require('bcryptjs')
const Task = require('../task/tasks')
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
        trim:true,
        validate(value) {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password is weak!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
UserSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})
UserSchema.methods.toJSON=function(){
    const user =this
    const userObject= user.toObject()
    delete userObject._id
    delete userObject.__v
    delete userObject.password
    delete userObject.tokens
    return userObject
}
UserSchema.statics.findByCredentials=async function(email,password){
   const credentials= await User.findOne({email})
   if(password === credentials.password)
        {
            return credentials
        }
    throw new Error('AUTHENTICATION FAILED !')
}
UserSchema.methods.generateJWT =async function(){
    try
    {
        const user = this
        const JWToken =await jwt.sign({_id: user._id},'SECRET_KEY')
        user.tokens=user.tokens.concat({token:JWToken})
        await user.save()
        return JWToken
    }
    catch(e)
    {
        console.log(e)
    }
}
const User=mongoose.model('User',UserSchema)
module.exports=User
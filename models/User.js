const mongoose=require('mongoose')
//const connection=require('../index')


const userSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    passwordResetAt:{
        type:Date,
    },
    role:{
        type:String,
        enum:['Super','Manager','Supervisor','Associate'],
        require:true
    },
    Manager:{
        type:String,
    },
    age:{
        type:Number,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    isTemporaryPassword:{
        type:Boolean,
        require:true
    },
    isActive:{
        type:Boolean,
        require:true
    },
    photo:{
        type:String
    },
    address:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    



})



const User=mongoose.model('User',userSchema)
module.exports=User
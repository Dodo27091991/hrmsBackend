const mongoose=require('mongoose')
const User = require('./User')

const attendanceSchema =mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        unique:true
    },
    day:{
        type:Number
    },
    month:{
        type:Number
    },
    year:{
        type:Number
    },
    attendance:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }

})

const Attendance=mongoose.model('Attendance',attendanceSchema)
module.exports=Attendance
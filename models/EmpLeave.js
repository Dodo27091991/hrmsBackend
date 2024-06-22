const mongoose=require('mongoose')
//const connection=require('../index')


const leavesSchema=mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    sickLeave:{
        type:Number,
        default:0
    },
    planLeave:{
        type:Number,
        default:0
    },
    casualLeave:{
        type:Number,
        default:0
    },
    paternatyLeave:{
        type:Number,
        default:0
    },
    maternatyLeave:{
        type:Number,
        default:0
    },    
})


const EmpLeave=mongoose.model('EmpLeave',leavesSchema)
module.exports=EmpLeave
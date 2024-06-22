const mongoose=require('mongoose')

const imgSchema=mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    tag:{
        type:String,
        require:true
    },
    desc:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    photo:{
        type:String
    }
})

const Image=mongoose.model('Image',imgSchema)

module.exports=Image
const jwt =require('jsonwebtoken')
const User = require('../models/User')


exports.protect=async (req,res,next)=>{
    const token =req.headers.token

    try{
    const user = jwt.verify(token,process.env.JWT_SECRET)


    const freshUser = await User.findById(user.id)

    if(!freshUser){
        return res.status(404).json({
            "status":"User does not exists",
            "message":"Please login again with correct credential as this user does not exists anymore"
        })
    }

    if(freshUser.passwordChangedAt){
        if(user.iat<parseInt(freshUser.passwordChangedAt.getTime()/1000))
        {
            return res.status(404).json({
                "status":"Unable to recognize user",
                "message":"Seems your password has been changed. Please login again"
            })
       }
    }

    req.user=freshUser
    console.log("User is Authorized")
    next()
}catch(error){
    res.send(error)
}

}
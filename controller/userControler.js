const User = require('../models/User')
const {validationResult}=require('express-validator')
const bcript = require('bcryptjs')
const jwt=require('jsonwebtoken')
const EmpLeave = require('../models/EmpLeave')



exports.signup=async(req,res)=>{
    const result=validationResult(req)

    //console.log(result.isEmpty())
    if(!result.isEmpty()){
        return res.status(400).json({
            "status":"Fail",
            "message":"Make sure that your password is of at leas 8 character Alpha Numeric and email address is correct"
        })
    }

    const {name,email,password,confirmPassword,role,age,gender,manager}=req.body
    try{
    if (!password===confirmPassword){
        return res.send("You password and confirm password does not match")
    }

    const existUser = await User.findOne({email:email})

    if(!existUser){
    hashPassword=await bcript.hash(req.body.password,12)
    console.log(hashPassword)

    const user=await User.create({
        name:name,
        email:email,
        password:hashPassword,
        role:req.body.role,
        age:req.body.age,
        gender:req.body.gender,
        role:role,
        age:age,
        gender:gender,
        Manager:manager,
        isTemporaryPassword:true,
        isActive:true,
        phoneNumber:req.body.phone,
        address:req.body.address,
        photo:''

    })
    const userr=await EmpLeave.create({user:user._id,sickLeave:0,planLeave:0,casualLeave:0,maternatyLeave:0,paternatyLeave:0})
    //await user.save()
    return res.status(200).json({
        "status":"Success",
        "message":"User has been created. User can reset the password and login"
    })
    }
    else{
        return res.status(400).json({
            "status":"Fail",
            "message":"User Already exists"
        })    
}

}catch (error){
    return res.status(200).json({

    })
}
}

exports.login=async(req,res)=>{


    const result=validationResult(req)

    if(!result.isEmpty()){
        return res.status(404).json({
            "status":"Invalid Credential",
            "message":"Please try again with correct credential"
        })
    }

    try{
    const user = await User.findOne({email:req.body.email})
    console.log(user)
    if(user===null){
        return res.status(404).json({
            "status":"Invalid Credential",
            "message":"Please try again with correct credential"
        })
    }
    const isValidUser= await bcript.compare(req.body.password,user.password)
    console.log(isValidUser)
    if(!isValidUser){
        return res.status(404).json({
            "status":"Invalid Credential",
            "message":"Please try again with correct credential"
        })
    }

    const jwtToken=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})

    if(user.isTemporaryPassword){
        return res.status(400).json({
            "status":"Password reset required",
            "message":"You're trying to login using Temporary password. Please reset password"
        })
    }

    console.log(user.role)
    return res.status(200).json({
        "status":"success",
        "token":jwtToken,
        "role":user.role,
        "name":user.name
    })
}
catch (error){
    return res.status(404).json({
        "status":"Invalid Credential",
        "message":"Please try again with correct credential"
    })
}

}


exports.resetPassword=async(req,res)=>{
    console.log("*********************")
    console.log(req.body)
    try{
    if(!req.body.changedPassword===req.body.confirmChangedPassword){


        return res.status(400).json({
            "status":"Fail",
            "message":"Password and confirm password does not match"
        })
    }
        const user = await User.findOne({email:req.body.email})
        const compare=await bcript.compare(req.body.password,user.password)
        console.log(compare)

        if(!compare)
        {
            console.log('check 4')
            return res.status(400).json({
                "status":"Fail",
                "message":"Incorrect password"
            })
        }

    hashPassword=await bcript.hash(req.body.changedPassword,12)
    const user1= await User.findByIdAndUpdate({_id:user._id},{$set:{
        password:hashPassword,
        passwordResetAt:Date.now(),
        isTemporaryPassword:false
    }})
    await user1.save()
    console.log('User saved successfully')
    return res.status(200).json({
        "status":'Success',
        "message":"Your password has been reset"
        })
    
    }
    catch(error){
        return res.status(400).json({
            "status":'something went wrong',
            "message":""
        }
        )
    }

}


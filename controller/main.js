const Attendance = require("../models/Attendance")
const EmpLeave = require("../models/EmpLeave")
const User=require('../models/User')
const Image=require('../models/UserImage')


exports.main = async(req,res)=>{
    console.log(req.file)
    console.log(req.body)

    const user=await Image({
        title:'photo',
        tag:'MyUser',
        desc:'this is a test for image storage',
        photo:req.file.filename

    })
    
    user.save()
    res.send(user)
}
// _______________________________-End Function


//  **************************************************************Function to Mark Attendance
exports.attendance = async(req,res) =>{

    if(!req.body.attendance){

    return res.status(400).json({
        "status":'error',
        "data":"Please try againg with correct data"
    })
    }

    try{
    
    const getAttendance= await Attendance.findOne({user:req.user._id,day:req.body.day,month:req.body.month,year:req.body.year})
    
    
    if(!getAttendance){
    const attendanceStatus = await Attendance.create({
        user:req.user._id,
        day:req.body.day,
        month:req.body.month,
        year:req.body.year,
        attendance:req.body.attendance
    })

    res.status(200).json({
        "status":'Success',
        "data":attendanceStatus
    })
    }

    else{

        const attendanceStatus = await Attendance.updateOne({_id:getAttendance._id,},{attendance:req.body.attendance})
    
        res.status(200).json({
            "status":'Success',
            "data":attendanceStatus
        })

    }
    
}
catch(error){
    res.status(400).json({
        "status":"error",
        "data":error
    })
}
}
// _______________________________-End Function


exports.getattendance = async(req,res)=>{

    if(!req.body.year){
        return res.status(404).json({
            "status":"error",
            "data":"No Data"
        })
    }
    try{
    const getDetail= await Attendance.findOne({user:req.user._id,day:req.body.day,month:req.body.month,year:req.body.year})
    
    if(!getDetail){

        return res.status(200).json({
            "status":"Fail",
            "data":getDetail
    

    })
}

    return res.status(200).json({
        "status":"Success",
        "data":getDetail
    })
    }
    catch (error){
        return res.status(404).json({
            "status":"error",
            "data":error
        })
    }
}

exports.createUser=(req,res)=>{
    res.send("successfull")
}

// _______________________________-End Function


exports.attendanceManage= async(req,res)=>{
    const users=await User.find({Manager:req.user.name,isActive:true})
    res.status(200).json({
        status:'success',
        data:users
    })
}
// _______________________________-End Function


exports.getAttendanceToUpdate=async(req,res)=>{

    const {employee,year,month,day}=req.body

    const user=await User.findOne({email:employee})
    if(!user){
        return res.status(200).json({
            status:"success",
            data:"No Such Employee"
        })
            
    }
    const attendance=await Attendance.findOne({user:user._id,year:year,month:month,day:day})

    if(!attendance){
        return res.status(200).json({
            status:"success",
            data:"Not Marked"
        })
    
    }

    return res.status(200).json({
        status:"success",
        data:attendance.attendance
    })

}

// _______________________________-End Function

//******************************************************************************************************************* */
// *********************************************HandleChangeAttendance Function for Attendance correction
exports.handleChangeAttendance=async(req,res)=>{

    const {employee,year,month,day,attendance}=req.body

    const user=await User.findOne({email:employee,isActive:true})
    if(!user){
        return res.status(200).json({
            status:"success",
            data:"No Such Employee"
        })
            
    }
    console.log(user)

    const existAttendance=await Attendance.findOne({user:user._id,year:year,month:month,day:day})

    const profile=await EmpLeave.findOne({user:user._id})
    if(!existAttendance){
        if(attendance==='Sick Leave'){
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave-1}})
            const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:attendance})

        }
        else if(attendance==='Plan Leave'){
            const update=await EmpLeave.updateOne({user:user._id},{$set:{planLeave:profile.planLeave-1}})
            const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:attendance})
        }
        else if(attendance==='Casual Leave'){
            const update=await EmpLeave.updateOne({user:user._id},{$set:{casualLeave:profile.casualLeave-1}})
            const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:attendance})
        }
        else if(attendance==='Paternaty Leave'){
            const update=await EmpLeave.updateOne({user:user._id},{$set:{paternatyLeave:profile.paternatyLeave-1}})
            const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:attendance})
        }
        else if(attendance==='Maternaty Leave'){
            const update=await EmpLeave.updateOne({user:user._id},{$set:{maternatyLeave:profile.maternatyLeave-1}})
            const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:attendance})
        }
        else if(attendance==='Half-Day'){
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave-0.5}})
            const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:attendance})
        }
        else{
            const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:attendance})
        }
    }
    else{
        if(existAttendance.attendance==='Present' && attendance==='Sick Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave-1}})    
        }
        else if(existAttendance.attendance==='Present' && attendance==='Plan Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{planLeave:profile.planLeave-1}})    
        }
        else if(existAttendance.attendance==='Present' && attendance==='Casual Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{casualLeave:profile.casualLeave-1}})    
        }
        else if(existAttendance.attendance==='Present' && attendance==='Maternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{maternatyLeave:profile.maternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Present' && attendance==='Paternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{paternatyLeave:profile.paternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Present' && attendance==='Half-Day'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave-0.5}})    
        }


        // * *********************************** changing Sick Leave to Other Leaves
        else if(existAttendance.attendance==='Sick Leave' && attendance==='Casual Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+1,casualLeave:profile.casualLeave-1}})    
        }
        else if(existAttendance.attendance==='Sick Leave' && attendance==='Plan Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+1,planLeave:profile.planLeave-1}})    
        }
        else if(existAttendance.attendance==='Sick Leave' && attendance==='Maternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+1,maternatyLeave:profile.maternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Sick Leave' && attendance==='Paternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+1,paternatyLeave:profile.paternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Sick Leave' && attendance==='Half-Day'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+0.5}})    
        }

        // ************************************ changing Plan Leave to Other Leave
        else if(existAttendance.attendance==='Plan Leave' && attendance==='Sick Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{planLeave:profile.planLeave+1,sickLeave:profile.sickLeave-1}})    
        }
        else if(existAttendance.attendance==='Plan Leave' && attendance==='Casual Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{planLeave:profile.planLeave+1,casualLeave:profile.casualLeave-1}})    
        }
        else if(existAttendance.attendance==='Plan Leave' && attendance==='Maternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{planLeave:profile.planLeave+1,maternatyLeave:profile.maternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Plan Leave' && attendance==='Paternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{planLeave:profile.planLeave+1,paternatyLeave:profile.paternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Plan Leave' && attendance==='Half-Day'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{planLeave:profile.planLeave+1,sickLeave:profile.sickLeave-0.5}})    
        }
        // ****************************************changing Casual Leave to Other Leave
        else if(existAttendance.attendance==='Casual Leave' && attendance==='Sick Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{casualLeave:profile.casualLeave+1,sickLeave:profile.sickLeave-1}})    
        }
        else if(existAttendance.attendance==='Casual Leave' && attendance==='Plan Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{casualLeave:profile.casualLeave+1,planLeave:profile.planLeave-1}})    
        }
        else if(existAttendance.attendance==='Casual Leave' && attendance==='Maternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{casualLeave:profile.casualLeave+1,maternatyLeave:profile.maternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Casual Leave' && attendance==='Paternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{casualLeave:profile.casualLeave+1,paternatyLeave:profile.paternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Casual Leave' && attendance==='Half-Day'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{casualLeave:profile.casualLeave+1,sickLeave:profile.sickLeave-1}})    
        }

        //******************************************Changing Maternaty Leave to Other */
        else if(existAttendance.attendance==='Maternaty Leave' && attendance==='Sick Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{maternatyLeave:profile.maternatyLeave+1,sickLeave:profile.sickLeave-1}})    
        }
        else if(existAttendance.attendance==='Maternaty Leave' && attendance==='Plan Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{maternatyLeave:profile.maternatyLeave+1,planLeave:profile.planLeave-1}})    
        }
        
        else if(existAttendance.attendance==='Maternaty Leave' && attendance==='Casual Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{maternatyLeave:profile.maternatyLeave+1,casualLeave:profile.casualLeave-1}})    
        }
        else if(existAttendance.attendance==='Maternaty Leave' && attendance==='Paternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{maternatyLeave:profile.maternatyLeave+1,paternatyLeave:profile.paternatyLeave-1}})    
        }

        //****************************************Changing Paternaty Leave to Other Leave */

        else if(existAttendance.attendance==='Paternaty Leave' && attendance==='Sick Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{paternatyLeave:profile.paternatyLeave+1,sickLeave:profile.sickLeave-1}})    
        }
        else if(existAttendance.attendance==='Paternaty Leave' && attendance==='Plan Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{paternatyLeave:profile.paternatyLeave+1,planLeave:profile.planLeave-1}})    
        }
        else if(existAttendance.attendance==='Paternaty Leave' && attendance==='Casual Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{paternatyLeave:profile.paternatyLeave+1,casualLeave:profile.casualLeave-1}})    
        }
        else if(existAttendance.attendance==='Paternaty Leave' && attendance==='Maternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{paternatyLeave:profile.paternatyLeave+1,maternatyLeave:profile.maternatyLeave-1}})    
        }
        // *******************************************Changing Half-Day to other Leaves
        else if(existAttendance.attendance==='Half-Day' && attendance==='Sick Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave-0.5}})    
        }
        else if(existAttendance.attendance==='Half-Day' && attendance==='Plan Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+0.5,planLeave:profile.planLeave-1}})    
        }
        else if(existAttendance.attendance==='Half-Day' && attendance==='Casual Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+0.5,casualLeave:profile.casualLeave-1}})    
        }
        else if(existAttendance.attendance==='Half-Day' && attendance==='Maternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+0.5,maternatyLeave:profile.maternatyLeave-1}})    
        }
        else if(existAttendance.attendance==='Half-Day' && attendance==='Paternaty Leave'){
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
            const update=await EmpLeave.updateOne({user:user._id},{$set:{sickLeave:profile.sickLeave+0.5,maternatyLeave:profile.maternatyLeave-1}})    
        }

        // ******************************************For All other condition
        else{
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{attendance:attendance}})
        }
    }
    return res.status(200).json({
        status:"success",
        data:"Your Attendance has been updated"
    })
}

// -----------------------------------------------------------------------------------------------
//__________________________________________________________________________End Function

exports.getRole=async(req,res)=>{
    const user=await User.findOne({email:req.body.employee,isActive:true})
    if(!user){
        return res.json({
            status:"success",
            data:"User not Exists"
        })    
    }
    return res.json({
        status:"success",
        data:user.role
    })
}


//******************Update Role */
exports.UpdateRole=async(req,res)=>{

    console.log(req.body)
    const user=await User.updateOne({email:req.body.employee,isActive:true},{$set:{role:req.body.role}})
    if(!user){
        return res.json({
            status:"success",
            data:"User not Exists"
        })    
    }
    console.log(user)
    return res.json({
        status:"success",
        data:"Role Has been Updated"
    })
}

exports.broadcast=async(req,res)=>{

    const {holiday,year,month,day}=req.body

    try{
    const users=await User.find({isActive:true})
    
    users.map(async(user)=>{
        const existAttendance=await Attendance.findOne({user:user._id,year:year,month:month,day:day})

            if(!existAttendance){
                const attendanceUpdate=await Attendance.create({user:user._id,year:year,month:month,day:day,attendance:holiday})
        }
    

            else{
            const attendanceUpdate=await Attendance.updateOne({user:user._id,year:year,month:month,day:day},{$set:{
                user:user._id,
                day:day,
                month:month,
                year:year,
                attendance:holiday
    }})}
    })

    res.json({
        status:"success",
        data:"Holiday BroadCasted for All"
    })

    }catch(error){
        res.json({
            status:"Fail",
            data:"Some Error Occurrect Please try Again"
        })  
    }
}

exports.deactivate=async(req,res)=>{

    const {user,action}=req.body
    try{
    const result=await User.updateOne({email:user},{$set:{isActive:action}})

    return res.json({
        status:"success",
        data:"User has been Deactivated..."
    })

    }catch(error){
        return res.json({
            status:"Fail",
            data:"Some Error Occurrect Please try Again"
        })  
    }
}

exports.getManager=async(req,res)=>{

    const data=await User.find({role:{$in:["Super","Manager","Supervisor"]}})
    console.log(data)
    res.status(200).json({
        status:'success',
        data:data
    })
}

exports.changeSupervisor=async(req,res)=>{
    const {user,action}=req.body

    const userexists=await User.findOne({email:user,isActive:true})
    if(!userexists){
        return res.status(200).json({
            status:"success",
            data:"No Such Employee"
        })
    }
    else{
        const result=await User.updateOne({email:user},{$set:{role:action}})
        return res.status(200).json({
            status:"success",
            data:`New Supervisor for the Employee is : ${action}`
        })
    }
    
            
}

exports.getUserProfile=async(req,res)=>{

    const {_id}=req.user
    
    const profile=await EmpLeave.findOne({user:_id})

    console.log(req.user)
    console.log(profile)

    res.status(200).json({
        status:"success",
        data:{
        name:req.user.name,
        email:req.user.email,
        role:req.user.role,
        manager:req.user.Manager,
        age :req.user.age,
        gender:req.user.gender,
        planLeave:profile.planLeave,
        sickLeave:profile.sickLeave,
        casualLeave:profile.casualLeave,
        maternatyLeave:profile.maternatyLeave,
        paternatyLeave:profile.paternatyLeave,
        photo:req.user.photo,
        phone:req.user.phoneNumber,
        address:req.user.address
    }
    })

}


exports.getEmpProfile=async(req,res)=>{

    const emp=req.body.employee
    console.log(emp)

    const user=await User.findOne({email:emp})
    if(!user){
        return res.status(200).json({
            status:'Fail',
            data:"No such User"
        })
    }

    const profile=await EmpLeave.findOne({user:user._id})

    res.status(200).json({
        status:"success",
        data:profile
    })
}

exports.updatePhoto=async(req,res)=>{

    console.log("Photo Type:",req.file)
    console.log("Body :",req.body)

    if(!req.file){
        return res.status(200).json({
            status:"Fail",
            data:"Please enter the file name"
        })
    }

    try{    
    const updatedPhoto=await User.updateOne({email:req.user.email},{photo:req.file.filename})

    if(!updatedPhoto){
        return res.status(200).json({
            status:'Fail',
            data:"Seems you're not using correct file format"
        })
    }
    
    return res.status(200).json({
        status:"success",
        data:"Photo has been Updated"
    })
    }catch(error){
        return res.status(400).json({
            status:"Fail",
            data:"Unable to upload this photo"
        })
    }
}


exports.updatePhone=async(req,res)=>{

    try{
    const updateProfile=await User.updateOne({_id:req.user._id},{$set:{phoneNumber:req.body.phone}})
    if(!updateProfile){
        return res.status(400).json({
            status:"Fail",
            data:"No such User"
        })
    }
    return res.status(400).json({
        status:"success",
        data:"Phone number Updated Successfully"
    })
    }catch(error){
        return res.status(400).json({
            status:"Fail",
            data:"Unable to update Phone number. Please enter correct Phone number"
        })
    }
}


exports.updateAddress=async(req,res)=>{

    try{
    const user=await User.updateOne({_id:req.user._id},{address:req.body.address})
    if(!user){
        return res.status(400).json({
            status:"Fail",
            data:"No such User"
        })
    }
    return res.status(400).json({
        status:"success",
        data:"Address Updated Successfully"
    })
    }catch(error){
        return res.status(400).json({
            status:"Fail",
            data:"Unable to update Address. Please try Again"
        })
    }
}



exports.maternatyFemale=async(req,res)=>{
    
    const {user,leave}=req.body
    try{
        const existuser=await User.findOne({email:user})
        if(!user){
            return res.status(200).json({
                status:"success",
                data:"No Such Employee"
            })       
    }
    const leave1=await EmpLeave.updateOne({user:existuser._id},{$set:{maternatyLeave:leave}})
    return res.status(200).json({
        status:'success',
        data:"Leave has been Granted"
    })
}catch(error){
    res.status(200).json({
        status:'Fail',
        data:"Some Error Occured"
    })
    
}
}

exports.paternatyMale=async(req,res)=>{
    
    const {user,leave}=req.body
    console.log(req.body)
    try{
        const existuser=await User.findOne({email:user})
        console.log(user)
        if(!user){
            return res.status(200).json({
                status:"success",
                data:"No Such Employee"
            })       
        }
        const leave1=await EmpLeave.updateOne({user:existuser._id},{$set:{paternatyLeave:leave}})
        return res.status(200).json({
            status:'success',
            data:"Leave has been Granted"
        })
    }catch(error){
        res.status(200).json({
            status:'Fail',
            data:"Some Error Occured"
        })
        
    }
}



// ************************************ Not a real route just a phone number
exports.main = async(req,res)=>{
    res.status(200).json({
        status:"success",
        data:'data'
    })
}

exports.getattendance2 = async(req,res)=>{

    
    try{
    const getDetail= await Attendance.find({user:req.user._id,month:req.body.month,year:req.body.year})
    
    if(!getDetail){

        return res.status(200).json({
            "status":"Fail",
            "data":'Attendance Not exists'
    

    })
}

    return res.status(200).json({
        "status":"Success",
        "data":getDetail
    })
    }
    catch (error){
        return res.status(404).json({
            "status":"error",
            "data":error
        })
    }
}


const User =require('../models/User')
const EmpLeave= require('../models/EmpLeave')
const schedule=require('node-schedule')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/hrms").then((con)=>{
    console.log("connected to database")
}).catch((error)=>{
    console.log("There is an error")
})

const sickLeave=1.5
const planLeave=1.5
const casualLeave=.80


const creditLeaveScheduler=schedule.scheduleJob('* 0 0 1 * *', async() => {

        try{
        const user=await User.find({isActive:true})
        if(user.length>0){

            user.map(async(u)=>{
            
                const profile=await EmpLeave.find({user:u._id})
                if(profile.length===0){
                    const createProfile=await EmpLeave.createProfile({
                        user:u._id,
                        sickLeave:sickLeave,
                        planLeave:planLeave,
                        casualLeave:casualLeave
                    })
                }else{
                    const updateProfile=await EmpLeave.updateOne({user:u._id},{$set:{
                        sickLeave:profile[0].sickLeave+sickLeave,
                        planLeave:profile[0].planLeave+planLeave,
                        casualLeave:profile[0].casualLeave+casualLeave
                    }})
                }
            })
            console.log("Leaves Updated")
        }else{
            console.log("No user exists")
        }
        }catch(error){
            console.log(error)
        }
      });
      



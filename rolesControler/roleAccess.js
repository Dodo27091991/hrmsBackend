
exports.roleControler=(roles)=>{

    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return res.send("You're not Authorize this resourse")
        }
        console.log("Role permited")
        next()
    }

}


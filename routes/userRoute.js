const express = require('express')
const userControler=require('../controller/userControler')
const validator=require('../validator/checkIt')
const router=express.Router()
const authenticate = require('../middleware/authenticate')
const main=require('../controller/main')
const roleControler=require('../rolesControler/roleAccess')

const multer=require('multer')

//********************** Multer Middleware********************* */

const multerStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/img')
    },
    filename:(req,file,cb)=>{
        const ext=file.mimetype.split('/')[1]
        cb(null,`photo${req.user._id}${Date.now()}.${ext}`)
    }
})

const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb('Error',false)
    }
}

//const upload=multer({dest:'public/img'})
const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

//______________________________________________

router.post('/signup',validator.checkIt,userControler.signup)

router.post('/login',validator.checkIt1,userControler.login)

router.post('/main',authenticate.protect,main.main)

router.post('/attendance',authenticate.protect,main.attendance)

router.post('/getAttendance',authenticate.protect,main.getattendance)

router.post('/getAttendance2',authenticate.protect,main.getattendance2) //Not a Real route. Just for Testing

router.post('/resetPassword',userControler.resetPassword)

router.get('/getUserProfile',authenticate.protect,main.getUserProfile)

router.post('/updatePhoto',authenticate.protect,upload.single('photo'),main.updatePhoto)

router.post('/updatePhone',authenticate.protect,main.updatePhone)

router.post('/updateAddress',authenticate.protect,main.updateAddress)

// *********************** Access control base route ********************************

router.post('/createUser',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.createUser)

router.get('/manageAttendance',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.attendanceManage)

router.post('/getAttendanceToUpdate',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.getAttendanceToUpdate)

router.post('/handleChangeAttendance',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.handleChangeAttendance)

router.post('/getRole',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.getRole)

router.post('/updateRole',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.UpdateRole)

router.post('/broadcast',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.broadcast)

router.post('/deactivate',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.deactivate)

router.get('/getManager',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.getManager)

router.post('/changeSupervisor',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.changeSupervisor)

router.post('/getEmpProfile',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.getEmpProfile)

router.post('/maternatyFemale',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.maternatyFemale)

router.post('/paternatyMale',authenticate.protect,roleControler.roleControler(['Super','Manager','Associate']),main.paternatyMale)

// _________________________End Main Route
router.get('/check',main.main)


module.exports = router
const {body,validationResult}=require('express-validator')

exports.checkIt =[
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    
]

exports.checkIt1 =[
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    
]

exports.checkIt2=[
    body('phone').isNumeric()
]

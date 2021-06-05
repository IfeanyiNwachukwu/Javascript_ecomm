const {check} = require('express-validator');
const usersRepo = require('../../repositories/users');



module.exports = {
    requireTitle : check('title')
    .trim()
    .isLength({min:5,max:40})
    .withMessage('Must be between 5 and 40 characters'),
   
    requirePrice : check('price')
    .trim()
    .toFloat()
    .isFloat({min:1})
    .withMessage('Must be a number greater than 1'),
   
    requireEmail : check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async(email) => {
        const existingUser = await usersRepo.GetOneBy({email});
        if(existingUser){
            throw new Error('Email is already in use');
        }
    }),
    
    requirePassword : check('password')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Must be between 4 and 20 characters'),

    requirePasswordConfirmation : check('passwordConfirmation')
    .trim()
    .isLength({min:4,max:20})
    .custom(async (passwordConfirmation,{req}) => {
        console.log(req.body.password);
        console.log(passwordConfirmation);
        if(passwordConfirmation !== req.body.password){
            throw new Error('Password and passwordConfirmation must match')
        }
    }),
    

    requireEmailExists :  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is not valid')
    .custom(async (email) => {
        const user = await usersRepo.GetOneBy({ email });
        if (!user) {
            throw new Error('Email not found!');
        }
    }),
    requireValidpasswordForUser : check('password')
    .trim()
    .custom(async (password,{req}) => {
        const user = await usersRepo.GetOneBy({email:req.body.email});
        if(!user){
            throw new Error('Invalid password');
        }
        const validPassword = await usersRepo.ComparePasswords(user.password, password);
        if (!validPassword) {
            throw new Error('password entered is not a valid password');
        }
    }),

    



}








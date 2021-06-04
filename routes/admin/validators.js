const {check} = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireEmail : check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is not valid')
    .custom(async(email) => {
        const existingUser = await usersRepo.GetOneBy({email});
        if(existingUser){
            throw new Error('Email is already in use');
        }
    }),
    
    requirePassword : check('password')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('password must have a minimum of 4 characters and a maximum of 20 characters'),

    requirePasswordConfirmation : check('passwordConfirmation')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('password must have a minimum of 4 characters and a maximum of 20 characters')
    .custom((passwordConfirmation,{req}) => {
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
    })



}








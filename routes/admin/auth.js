const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {requireEmail,requirePassword,requirePasswordConfirmation} = require('./validators')
const {check,validationResult} = require('express-validator');

const router = express.Router();

// Creating a route Handler
router.get('/signup',(req,res) =>{
    res.send(signupTemplate({req}));
});


router.post('/signup',[requireEmail,requirePassword,requirePasswordConfirmation
],async (req,res) => {   // to avoid copying and pasting this particular line of code everywhere we have a post request.
    //req.on is similar to an addEventListener but this time it is listening for a data object
   
    const {email,password,passwordConfirmation} = req.body;
   
    // Create a user in our user repo to represent this person
    const user = await usersRepo.Create({email,password});

    // Store the id of that user inside the users cookie... req.session is a property added by the cookie sessions
    req.session.userId = user.Id;

    res.send('Account created!!!');
})

router.get('/signout',(req,res) => {
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin', (req,res) =>{
    res.send(signinTemplate());
});

router.post('/signin',[
    check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Email is not valid')
        .custom(async (email) => {
            const user = await usersRepo.GetOneBy({ email });
            if (!user) {
                throw new Error('This user does not exist');
            }
        }),
        check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('password must have a minimum of 4 characters and a maximum of 20 characters')
        .custom(async (password) => {
            const user = await usersRepo.GetOneBy({ email });
            const validPassword = await usersRepo.ComparePasswords(user.password, password);
            if (!validPassword) {
                throw new Error('password entered is not a valid password');
            }
        })
    ], 
    async (req,res) => {
    const errorMessages = validationResult(req);
    console.log(errorMessages);
    const {email,password} = req.body;
    const userAccount = await usersRepo.GetOneBy({email});
    if(userAccount ){
        req.session.userId = userAccount.Id;
        res.send('You are signed in')
        return;
    }
    res.send('sign in was unsucessful');
   
   
   
});

module.exports = router;

function checkSignInPassword() {
    return ;
}

function checkSignInEmail() {
    return ;
}


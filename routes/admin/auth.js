const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {requireEmail,requirePassword,requirePasswordConfirmation,requireEmailExists,requireValidpasswordForUser} = require('./validators');
const {handleErrors} = require('./middlewares');


const router = express.Router();

// Creating a route Handler
router.get('/signup',(req,res) =>{
    res.send(signupTemplate({req}));
});


router.post('/signup',[requireEmail,requirePassword,requirePasswordConfirmation
],handleErrors(signupTemplate), async (req,res) => { 
   
    
    const {email,password} = req.body;
   
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
    res.send(signinTemplate({}));
});

router.post('/signin',[requireEmailExists,requireValidpasswordForUser], 
    handleErrors(signinTemplate),
    async (req,res) => {
   
    const {email} = req.body;
    const userAccount = await usersRepo.GetOneBy({email});
    if(userAccount ){
        req.session.userId = userAccount.Id;
        res.send('You are signed in')
        return;
    }
    // res.send('sign in was unsucessful');
   
   
   
});

module.exports = router;




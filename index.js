// CREATING A WEB SERVER WITH EXPRESS
const express = require('express');
const cookieSession = require('cookie-session');

const app = express();
app.use(express.urlencoded({extended:true})); // Global midddleware for parsing req object
app.use(cookieSession({keys:['lkasldkfjp3jp2ij5p2i35j']}));
//The keys property is used to encrypt all the information that is stored inside a cookie

const usersRepo = require('./repositories/users');


// Creating a route Handler
app.get('/signup',(req,res) =>{
    res.send(`
    <div>
        <form action="" method="POST">
            <input type="email" name="email" id="" placeholder="email">
            <input type="password" name="password" id="" placeholder="password">
            <input type="password" name="passwordConfirmation" id="" placeholder="confirm password">
            <button>Sign Up</button>
        </form>
    </div>
    `);
});


app.post('/signup',async (req,res) => {   // to avoid copying and pasting this particular line of code everywhere we have a post request.
    //req.on is similar to an addEventListener but this time it is listening for a data object
    
    const {email,password,passwordConfirmation} = req.body;
    const existingUser = await usersRepo.GetOneBy({email});
    if(existingUser){
        res.send('Email in use');
        return;
    }
    if(password !== passwordConfirmation){
       res.send('passwords must match');
       return;
    }
    // Create a user in our user repo to represent this person
    const user = await usersRepo.Create({email,password});

    // Store the id of that user inside the users cookie... req.session is a property added by the cookie sessions
    req.session.userId = user.Id;

    res.send('Account created!!!');
})

app.get('/signout',(req,res) => {
    req.session = null;
    res.send('You are logged out');
});

app.get('/signin', (req,res) =>{
    res.send(`
    <div>
    <form action="" method="POST">
        <input type="email" name="email" id="" placeholder="email">
        <input type="password" name="password" id="" placeholder="password">
        <button>Sign In</button>
    </form>
</div>
    `)
});

app.post('/signin', async (req,res) => {

    const {email,password} = req.body;
    const user = await usersRepo.GetOneBy({email});
    if(!user){
        res.send('This email does not exist');
        return;
    }
    if(password !== user.password){
        res.send('Invalid password');
        return;
    }

    req.session.userId = user.Id;
    res.send('You are signed in')
})


// req represents requests coming into our web server while res represents the response from our web server
app.listen(3000, ()=> {
    console.log('listening');
})






//#region Redundant

//next is just a sign that our function(middleware) has finished running, then Express can carry on from there
//  bodyParser  = (req, res, next) => {
//      if(req.method === 'POST'){
//         req.on('data', data => {
//             const parsed = data.toString('utf8').split('&');
//             const formData = {};
//             for (let pair of parsed) {
//                 const [key, value] = pair.split('=');
//                 formData[key] = value;
//             }
//             req.body = formData;
//             next();
//         });
//      }
//      else{
//          next();
//      }
   
// 


//#endregion






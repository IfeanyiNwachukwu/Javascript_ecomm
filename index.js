// CREATING A WEB SERVER WITH EXPRESS
const express = require('express');
const app = express();
app.use(express.urlencoded({extended:true})); // Global midddleware


// Creating a route Handler
app.get('/',(req,res) =>{
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
   
// }


app.post('/',express.urlencoded({extended:true}),(req,res) => {   // to avoid copying and pasting this particular line of code everywhere we have a post request.
    //req.on is similar to an addEventListener but this time it is listening for a data object
    console.log(req.body);
    res.send('Account created!!!');
})


// req represents requests coming into our web server while res represents the response from our web server
app.listen(3008, ()=> {
    console.log('listening');
})



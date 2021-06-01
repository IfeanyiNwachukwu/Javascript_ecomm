// CREATING A WEB SERVER WITH EXPRESS
const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(express.urlencoded({extended:true})); // Global midddleware for parsing req object
app.use(cookieSession({keys:['lkasldkfjp3jp2ij5p2i35j']}));
//The keys property is used to encrypt all the information that is stored inside a cookie
app.use(authRouter);  // available to all parts of our program






// req represents requests coming into our web server while res represents the response from our web server
app.listen(3000, ()=> {
    console.log('listening');
})





// Middlewares are available all through out the project



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






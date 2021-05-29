// CREATING A WEB SERVER WITH EXPRESS
const express = require('express');

const app = express();

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
})

app.post('/',(req,res) => {
    //req.on is similar to an addEventListener but this time it is listening for a data object
    req.on('data', data => {
        console.log(data.toString('utf8'));
    })
    res.send('Account created!!!');
})


// req represents requests coming into our web server while res represents the response from our web server
app.listen(3000, ()=> {
    console.log('listening');
})
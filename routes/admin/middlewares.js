const {validationResult} = require('express-validator');

module.exports = {
    handleErrors(templateFunc, dataCb){
        return async (req,res,next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                let data = {};
                if(dataCb){
                  data = await dataCb(req);
                }
                console.log({errors,...data});
                return res.send(templateFunc({errors,...data}));
            }
            next();
        }
    },

    requireAuth(req,res,next){
        if(!req.session.userId){
            return res.redirect('/signin');
        }
        next();
    }
};


//next is like a reference to a function to tell express that we are done with the function, and execution can flow out of the function
//dataCb is same as data call Back
const {validationResult} = require('express-validator');

module.exports = {
    handleErrors(templateFunc){
        return (req,res,next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return res.send(templateFunc({errors}))
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
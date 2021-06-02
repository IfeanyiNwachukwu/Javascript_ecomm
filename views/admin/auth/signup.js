const layout = require('../layout');
module.exports =  ({req}) => {
    return layout({content :  `
    <div>
    Your Id is : ${req.session.userId}
        <form action="" method="POST">
            <input type="email" name="email" id="" placeholder="email">
            <input type="password" name="password" id="" placeholder="password">
            <input type="password" name="passwordConfirmation" id="" placeholder="confirm password">
            <button>Sign Up</button>
        </form>
    </div>
`});
} 
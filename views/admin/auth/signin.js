const layout = require('../layout');
module.exports = () => {
    return layout({content :  `
    <div>
        <form action="" method="POST">
            <input  name="email" id="" placeholder="email">
            <input type="password" name="password" id="" placeholder="password">
            <button>Sign In</button>
        </form>
    </div>
    
    `});
}
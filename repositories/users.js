const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt); // Gives us a version of the scrypt function that returns a promise
const Repository = require('./repository');

class UserRepository extends Repository{
    Create = async(attrs) => {
        attrs.Id = this.RandomId();

        const salt = crypto.randomBytes(8).toString('hex');
        
        const buff = await scrypt(attrs.password,salt,64);
        
        const records = await this.GetAll();
        const record = {...attrs,password:`${buff.toString('hex')}.${salt}`}; // take everything in the attrs object and spread it into new object but overwrite the password property
        records.push(record);
        
        await this.WriteAll(records);
        return record;
    }

    ComparePasswords = async (saved,supplied) => {
        // Saved -> password saved in our database. 'hashed.salt
        // Supplied -> password given to us by a user trying to sign in

        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];

        const [hashed,salt] = saved.split('.');
        const hashSuppliedBuffer = await scrypt(supplied,salt,64);
        return hashed === hashSuppliedBuffer.toString('hex');
    }
}
// This is good because we only want one instance of the usersRepository
module.exports = new UserRepository('users.json');




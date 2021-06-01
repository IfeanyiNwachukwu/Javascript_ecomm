const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt); // Gives us a version of the scrypt function that returns a promise

class UserRepository{
        constructor(filename){
            // check if an argument was passed for the parameter filename
            if(!filename){
                throw new Error('A filename is needed to create a repository');
            }
            this.FileName = filename;
            try {
                // check directory if a file with such a file name exists in our directory
                fs.accessSync(this.FileName);
            } catch (error) {
                // if no file with such a filename exists
                // create one using that same filename
                fs.writeFileSync(this.FileName,'[]');
            }
        }
    
        GetAll = async () => {
         return await  JSON.parse(await fs.promises.readFile(this.FileName),{encoding:'utf8'}); //encoding which is optional is left out here because the default is utf8 which we want
        }
     
        RandomId = () => {
            return crypto.randomBytes(4).toString('hex');
        }

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

        async WriteAll(records) {
            await fs.promises.writeFile(this.FileName, JSON.stringify(records, null, 2));
        }

        GetOne = async(Id) => {
            const records = await this.GetAll();
            return records.find(record => record.Id === Id);
        }

        Delete = async(Id) => {
            // Get all the records
            const records = await this.GetAll();
            // filter records and retain only the records without the Id passed
            const filteredRecords = records.filter(record => record.Id !== Id);
            // Write the filtered records to our users.json file
            await this.WriteAll(filteredRecords);
        }

        Update = async(Id,attrs) => {
            //Fetch all records
            const records = await this.GetAll();
            // Find the record with the Id passed from the fetched records
            const record = records.find(record => record.Id === Id);
            // Throw an error if record was not found.
            if(!record){
                throw new Error(`user with Id of ${Id} not found`);
            }

            Object.assign(record,attrs);
            await this.WriteAll(records);
        }

        GetOneBy  = async(filters) => {
            const records = await this.GetAll();
            for(let record of records){
                let found = true;
                for(let key in filters){
                    if(record[key] !== filters[key]){
                        found = false;
                    }
                }
                if(found){
                    return record;
                }
            }
        }
}
// This is good because we only want one instance of the usersRepository
module.exports = new UserRepository('users.json');




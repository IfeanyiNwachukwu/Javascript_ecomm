const fs = require('fs');
const crypto = require('crypto');

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
            const records = await this.GetAll();
            records.push(attrs);
            await this.WriteAll(records);
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


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
}

const Test = async () => {
    const repo = new UserRepository('users.json');
    const data = await repo.GetOne("445b5980");
    console.log(data);
}
Test();
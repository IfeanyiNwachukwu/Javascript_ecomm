const fs = require('fs');
class UsersRepository{

    constructor(filename){
        if(!filename){
            throw new Error('Creating a repository requires a filename');
        }
        this.Filename = filename;
        try {
            fs.accessSync(this.Filename); // check if file exists
        } catch (error) {
            fs.writeFileSync(this.Filename, '[]') // If file does not exist, create a file with the same file name
        }
    }
    GetAll = async() => {
    //     // open the file called this.Filename
    //     // Read its contents
    //    const contents = await fs.promises.readFile(this.Filename,{encoding: 'utf8'});
    //    // parse the contents
    //     const data = JSON.parse(contents);
    //       // Return the parsed data
    //     return data;

       return JSON.parse(await fs.promises.readFile(this.Filename,{encoding: 'utf8'}))
       
    }

    Create = async(attrs) => {
        // load up the most recent file record
        const records = await this.GetAll();
        // Add the new record to the existing file record
        records.push(attrs);
        //Write the updated 'records' back to this.FileName
        await this.WriteAll(records);
    }


   async WriteAll(records) {
        await fs.promises.writeFile(this.Filename, JSON.stringify(records,null,2));
    }
}

const test = async () => {
    const repo = new UsersRepository('users.json');
    await repo.Create({email: 'gambo@yahoo.com',password: 'abcdefgh'});
    const data = await repo.GetAll();
    console.log(data);


}
test();
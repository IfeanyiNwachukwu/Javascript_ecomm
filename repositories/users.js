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
    getall = async() => {
        // open the file called this.Filename
        // Read its contents
        // parse the contents
        // Return the parsed data
        const contents = await fs.promises.readFile(this.Filename,{encoding: 'utf8'});
        console.log(contents);
    }







}

const test = async () => {
    const repo = new UsersRepository('users.json');
    await repo.getall();


}
test();
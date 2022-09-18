const fs = require('fs');

const md = `
# Title

Some text
`;

if (!fs.existsSync('./assets/tmp')) {
    console.log('directory exists');
    fs.mkdir('./assets/tmp', err => {
        if (err) { // err thrown if directory already exists
            throw err;
        }
        createFile();
    });
}

function createFile() {
    fs.writeFile('./assets/tmp/myfile.md', md.trim(), err => {
        if (err) throw err; // NO error thrown if file exists
        console.log("File written");
    });
}



const fs = require('fs');


const text = fs.readFileSync('./assets/Readme.md', "UTF-8");
console.log(text.toString());

// async
fs.readFile('./assets/Readme.md', "utf-8", (err, text) => console.log(text.toString()) )

// read binary
const img = fs.readFileSync('./assets/alex.jpg');
console.log(img);

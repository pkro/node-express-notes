const fs = require('fs');

// list files (synchronously), blocking further execution until done
const files = fs.readdirSync("./assets");
console.log(files);

// asnychronously
fs.readdir('./assets', (err, files) => {
    if (err) {
        throw err;
    }
    console.log(files);
})

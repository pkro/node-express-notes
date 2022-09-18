const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'assets', 'lorum-ipsum.md'), 'utf-8');

console.log("type something...");
//process.stdin.on("data", data => {
readStream.on("data", data => {
    console.log(`I read ${data.length - 1} characters of text`);
});

// just read the first chunk
readStream.once('data', data => console.log(data));

readStream.on('end', () => console.log("finished"));

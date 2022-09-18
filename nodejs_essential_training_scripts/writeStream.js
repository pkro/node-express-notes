const fs = require('fs');
const path = require('path');

// write to the stdout write stream
process.stdout.write('hello');

// same for file write stream
const writeStream = fs.createWriteStream(path.join(__dirname, 'assets', 'streamwritten.txt'), 'utf-8');

// overwrites content of the file if it existed before creating the writeStream
// as createWriteStream sets the file pointer to 0
writeStream.write('hello');
// appends to the file as the file pointer is now updated
writeStream.write(' world'); // content is now "hello world"

// write terminal input to file until ctrl-c
process.stdin.on("data", data => {
    writeStream.write(data);
});

// the same but shorter:
process.stdin.pipe(writeStream);


// copy content from readstream to write stream (file)
// here it appends to the stuff already appended above
// as we didn't create a new writeStream
const readStream = fs.createReadStream(path.join(__dirname, 'assets', 'lorum-ipsum.md'));

// same as readStream.pipe(writeStream);
readStream.on("data", data => {
    writeStream.write(data);
});





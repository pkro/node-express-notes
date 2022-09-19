import fs from 'fs';

const readStream = fs.createReadStream('../01/powder-day.mp4');
const writeStream = fs.createWriteStream('./copy.mp4');

readStream.on('data', chunk => {
    writeStream.write(chunk);
});

// or, shorter:

readStream.pipe(writeStream);

readStream.on('end', () => {
    console.log("done")
    writeStream.end(); // optionally allows for writing a final chunk
});

readStream.on('error', (error) => console.log(error.message));


/*
// pauses before first read from the stream
readStream.pause();
// wait for input / enter before reading the next chunk
process.stdin.on('data', data => {
    if (data.toString().trim() === 'finish') {
        readStream.resume(); // reads all remaining chunks
    }
    readStream.read();
});


readStream.on('end', () => console.log("done"));
readStream.on('error', (error) => console.log(error.message));

//process.stdin.on('data', data=>console.log(data.toString().trim()));
*/

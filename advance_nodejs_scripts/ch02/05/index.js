import { createReadStream, createWriteStream } from 'fs';

const readStream = createReadStream('../01/powder-day.mp4');
const writeStream = createWriteStream('./copy.mp4', {
    highWaterMark: 1628920
});

readStream.on('data', (chunk) => {
    const result = writeStream.write(chunk);
    if(!result) {
        console.log("backpressure");
        readStream.pause();
    }
});

writeStream.on('drain', ()=> {
    console.log('drained');
    readStream.resume();
})

readStream.on('error', (error) => {
    console.log('an error occurred', error.message);
});

readStream.on('end', () => {
    writeStream.end();
});

writeStream.on('close', () => {
    process.stdout.write('file copied\n');
})

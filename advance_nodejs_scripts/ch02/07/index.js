import {Duplex, PassThrough} from 'stream';
import { createReadStream, createWriteStream } from 'fs';

const readStream = createReadStream('../01/powder-day.mp4');
const writeStream = createWriteStream('./copy.mp4');

class Throttle extends Duplex {
    constructor(ms) {
        super();
        this.delay = ms;
    }

    // for a Duplex, we need to implement _read, _write and _final
    _read() {}

    _write(chunk, encoding, callback) {
        this.push(chunk);
        setTimeout(callback, this.delay)
    }

    _final() {
        this.push(null);
    }
}
const report = new PassThrough();
let total = 0;
report.on('data', data => console.log(`passed through ${total+=data.length}`));
const throttle = new Throttle();

readStream
    .pipe(throttle)
    .pipe(report)
    .pipe(writeStream);

readStream.on('error', (error) => {
    console.log('an error occurred', error.message);
});


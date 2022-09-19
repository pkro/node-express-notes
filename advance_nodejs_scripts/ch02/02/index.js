import {Readable} from 'stream';

const peaks = [
    "Tallac",
    "Ralston",
    "Rubicon",
    "Twin Peaks",
    "Castle Peak",
    "Rose",
    "Freel Peak"
];

class StreamFromArray extends Readable {
    constructor(array) {
        //super({encoding: 'utf-8'});
        super({objectMode: true});
        this.array = array;
        this.index = 0;
    }

    _read() { // must be implemented
        if (this.index <= this.array.length) {
            //const chunk = this.array[this.index];
            const chunk = {
                data: this.array[this.index],
                index: this.index
            }
            this.push(chunk);
            this.index++;
        } else {
            this.push(null); // indicate that stream is over
        }
    }
}

const peakStream = new StreamFromArray(peaks);

peakStream.on('data', chunk => console.log(chunk));
peakStream.on('end', () => console.log('done'));

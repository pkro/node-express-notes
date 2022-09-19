import {Transform} from 'stream';

class ReplaceText extends Transform {
    constructor(char) {
        super();
        this.replaceChar = char;
    }
    _transform(chunk, encoding, callback) {
        // replace all letters and numbers with the given character
        const transformChunk = chunk.toString().replace(/[a-zA-Z0-9]/g, this.replaceChar);
        this.push(transformChunk);
        callback();
    }
}

const replacer = new ReplaceText('X');

process.stdin.pipe(replacer).pipe(process.stdout);

/* in/output
fdsfasd,dfsdds
XXXXXXX,XXXXXX
 */

import {createServer} from 'http';
import {stat, createReadStream} from 'fs';
import {promisify} from 'util';

const fileInfo = promisify(stat);

const fileName = '../../ch02/01/powder-day.mp4';

createServer(async (req, res) => {
    const {size} = await fileInfo(fileName);
    const range = req.headers.range;
    console.log(range); // "bytes=0-" when skipping the video in the browser

    if (range) {
        let [start, end] = range.replace("bytes=", '').split('-');
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1; // if no end we set end to video length
        res.writeHead(206, { // code 206 = partial response
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': (end - start) + 1,
            'Content-Type': 'video/mp4'
        });
        createReadStream(fileName, {start, end}).pipe(res);
    } else {
        res.writeHead(200, {'Content-Type': 'video/mp4', 'Content-Length': size});
        createReadStream(fileName).pipe(res);
    }
}).listen(3000, () => console.log('running at http://localhost:3000'));




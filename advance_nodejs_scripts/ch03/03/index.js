import {createServer} from 'http';
import {stat, createReadStream, createWriteStream} from 'fs';
import {promisify} from 'util';

const fileInfo = promisify(stat);

const fileName = '../../ch02/01/powder-day.mp4';

const respondWithVideo = async (req, res) => {
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
};

createServer((req, res) => {
    if(req.method === 'POST') {
        req.pipe(res); // sends the file back to the browser (duh!)
        req.pipe(process.stdout); // just show it in the console for good measure
        req.pipe(createWriteStream('./upload.file')); // and save it
    }
    else if (req.url === '/video') {
        respondWithVideo(req, res);
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
        <form enctype="multipart/form-data" method="POST" action="/">
            <input type="file" name="upload-file" />
            <button>Upload file</button>
        </form>
        `);
    }
}).listen(3000, () => console.log('running at http://localhost:3000'));




import fs  from 'fs';
import http from 'http';
const file = './powder-day.mp4';

http.createServer((req, res) => {

    res.writeHeader(200, { 'Content-Type': 'video/mp4' });
    fs.createReadStream(file)
        .pipe(res)
        .on('error', console.error);

}).listen(3000, () => console.log('stream - http://localhost:3000'));

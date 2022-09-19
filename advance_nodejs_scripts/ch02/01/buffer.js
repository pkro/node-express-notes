import fs  from 'fs';
import http from 'http';
const file = './powder-day.mp4';

http.createServer((req, res) => {
    fs.readFile(file, (error, data) => {
        if (error) {
            console.log('hmmmm: ', error);
        }
        res.writeHeader(200, { 'Content-Type': 'video/mp4' });
        res.end(data);
    })

}).listen(3000, () => console.log('buffer - http://localhost:3000'));

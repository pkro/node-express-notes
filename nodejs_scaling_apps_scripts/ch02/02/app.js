import http from 'http';
import {LocalStorage} from 'node-localstorage';

const localStorage = new LocalStorage('./requests', 1024);

let requests = localStorage.getItem('requests');

if (!requests) {
    requests = 0;
    localStorage.setItem(requests);
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requests = +localStorage.getItem('requests') + 1;
        // there could still be a race condition between these 2 lines
        localStorage.setItem('requests', requests);
        console.log(`${process.pid}: ${requests}`);
        res.end(JSON.stringify(requests));
    }
});

server.listen(3000);
console.log(`counting requests`);

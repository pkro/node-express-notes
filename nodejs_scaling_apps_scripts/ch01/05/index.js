import http from 'http';
import cluster from 'cluster';
import {cpus} from 'os';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    console.log('this is the master process: ', process.pid);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', worker => {
        console.log(`worker ${process.pid} died,  ${Object.keys(cluster.workers).length} remain, forking 1 process`);
        cluster.fork();
    });

} else {
    console.log(`started worker at ${process.pid}`);
    http.createServer((req, res) => {
        res.end(`worker ${process.pid}...`);
        if (req.url === '/kill') {
            process.exit();
        }
        console.log(`working on request ${process.pid}`);
    }).listen(3000);
}

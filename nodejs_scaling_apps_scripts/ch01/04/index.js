import http from 'http';
import cluster from 'cluster';
import {cpus} from 'os';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
    console.log("this is the MASTER process", process.pid);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    http.createServer((req, res)=>{
        const message = `worker ${process.pid}`;
        console.log(message);
        res.end(message);
    }).listen(3000)
}

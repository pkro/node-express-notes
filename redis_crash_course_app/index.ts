import express from "express";
import axios from "axios";
import cors from "cors";
import * as redis from "redis"; // not just "import redis from redis"

// using localhost on default port
const redisClient: redis.RedisClientType = redis.createClient();
// using a (remote) URL
// const redisClient = redis.createClient( {url: 'redis://user:pass@example.com:13180'});

// we SHOULD await here or use redisClient.connect().then(()=>{... rest of the code })
// but the client is only used when a request comes in so the connection
// should be established by then
redisClient.connect();

// log all errors
redisClient.on('error', (err) => console.log('Redis Client Error', err));

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors());

const DEFAULT_EXPIRATION = 3600;

function getOrSetCache(key: string, cb: () => Promise<any>) {

    return new Promise((resolve, reject) => {
        // can't seem to get the types right for all the parameters
        // @ts-ignore
        redisClient.get(key, async (error: any, data: any) => {
            console.log(error, data);
            if (error) return reject(error);
            if (data != null) return resolve(JSON.parse(data));
            const freshData = await cb();
            redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
            resolve(freshData);
        });
    });
}

app.get("/photos", async (req: express.Request, res: express.Response) => {
    res.json({});
        const albumId = req.query.albumId;
        const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
            const {data} = await axios.get(
                "https://jsonplaceholder.typicode.com/photos",
                {params: {albumId}}
            );
            return data;
        });
        res.json(photos);
    }
);

app.get("/photos/:id", async (req: express.Request, res: express.Response) => {
    const {data} = await (axios.get(`https://jsonplaceholder.typicode.com/photos/${req.params.id}`));
    res.json(data);
});

app.listen(3000);

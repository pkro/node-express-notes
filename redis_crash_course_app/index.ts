import express from "express";
import axios from "axios";
import cors from "cors";

import Redis from "ioredis";

const redis = new Redis();
redis.on('error', (err) => console.log('Redis Client Error', err));

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors());

const DEFAULT_EXPIRATION = 3600;

function getOrSetCache(key: string, cb: () => Promise<any>) {
    return new Promise((resolve, reject) => {
        // can't seem to get the types right for all the parameters
        redis.get(key, async (error: any, data: any) => {
            if (error) return reject(error);
            if (data != null) {
                console.log('cache hit');
                return resolve(JSON.parse(data));
            }
            const freshData = await cb();
            redis.setex(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
            resolve(freshData);
        });
    });
}

app.get("/photos", async (req: express.Request, res: express.Response) => {
        const albumId = req.query.albumId;
        const photos = await getOrSetCache(`photos?albumId=${albumId}`, async () => {
            console.log("cache miss");
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
    const photos = await getOrSetCache(`photos:${req.params.id}`, async () => {
        console.log("cache miss");
        const {data} = await axios.get(
            `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
        );
        return data;
    });
    res.json(photos);
});

app.listen(3000);

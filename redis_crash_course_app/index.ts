import express  from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/photos", async (req: express.Request, res: express.Response) => {
    const albumId = req.query.albumId;
    const {data} = await (axios.get("https://jsonplaceholder.typicode.com/photos",
        {params: {albumId}}));
    res.json(data);
});

app.get("/photos:/id", async (req: express.Request, res: express.Response) => {
    const {data} = await (axios.get(`https://jsonplaceholder.typicode.com/photos/${req.params.id}`));
    res.json(data);
});

app.listen(3000)

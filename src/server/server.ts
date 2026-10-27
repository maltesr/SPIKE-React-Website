import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001; //maybe 4444?

app.use(cors());
app.use(express.json());

let gameData = {
    value: 0,
    clicks: 0
};

app.post("/api/game", (req, res) => {
    const {value, clicks} = req.body;

    gameData = {
        value,
        clicks
    }

    console.log("Current value: ", value);
    console.log("Current clicks: ", clicks)

    res.json({
        success: true,
        gameData
    });
});

app.get("/api/game", (req, res) => {
    res.json(gameData);
});

app.listen(port, () => {
    console.log(`Backend is running on http://localhost:${port}`);
});
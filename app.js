const express = require("express");
const connectDB = require("./db/connect");
const userRouter=require('./routes/userRouter')
const webHookRouter=require('./routes/webHookRouter')
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
    res.send("Hare Krishna Hare Ram");
});
app.use("/api/v1/hook",webHookRouter)
app.use(express.json());


app.use("/api/v1/route",userRouter)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await app.listen(port, () => {
            console.log(`Examples app listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();

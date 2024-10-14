import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./.env"});

const app = express();
app.use(express.json());
app.use(cors());
app.listen(3010, () => {
    console.log("App Server is running on port 3010");

});

const MongoUri = process.env.DRIVER_LINK;
const connectToMongo = async () => {
    try{
        await mongoose.connect(MongoUri);
        console.log("connected");
    }   catch(error){
        console.log(error.message);
    }
};
connectToMongo();
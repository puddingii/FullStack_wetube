import "./db";
import dotenv from "dotenv";
import app from "./app";
import "./models/Video";
import "./models/Comment";

dotenv.config();

const PORT =  4080 || process.env.PORT;

const handleListening = () => console.log(`Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
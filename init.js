import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/Comment";
import "./models/User";
import app from "./app";

const PORT =  4000 || process.env.PORT;

const handleListening = () => console.log(`Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
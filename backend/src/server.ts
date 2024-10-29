import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import connectMongo from "./database/connectMongo";
import routerStart from "./routes/auth.route";
import routerDisplay from "./routes/display.route";

const app = express();
let PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", routerStart);
app.use("/display", routerDisplay);

app.listen(PORT, () => {
  connectMongo();
  console.log(`listening to the server ${PORT}`);
});

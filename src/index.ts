import * as express from "express";
import * as path from "path";

const APP_PATH = path.resolve(__dirname, "app");
const app = express();

app.use("/", express.static(APP_PATH));

app.listen(80);

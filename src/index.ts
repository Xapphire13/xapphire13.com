import * as express from "express";
import * as path from "path";

const APP_PATH = path.resolve(__dirname, "app");
const app = express();

app.use("/app", express.static(APP_PATH));
app.get("*", (_req, res) => {
  res.sendfile(path.join(APP_PATH, "index.html"));
});

app.listen(80);

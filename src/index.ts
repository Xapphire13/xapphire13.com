import * as express from "express";
import * as path from "path";

const APP_PATH = path.resolve(__dirname, "app");
const app = express();

app.set('port', process.env.PORT || 80);

app.use("/app", express.static(APP_PATH));
app.get("*", (_req, res) => {
  res.sendFile(path.join(APP_PATH, "index.html"));
});

const server = app.listen(app.get("port"), () => {
  console.log("Listening on port " + server.address().port);
});

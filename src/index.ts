import * as express from "express";
import * as handlebars from "handlebars";
import * as path from "path";

const APP_PATH = path.resolve(__dirname, "app");
const HTML_TEMPLATE = handlebars.compile(`
<html>
  <head>
    <title>{{title}}</title>
  </head>
  <body>
    <script src="app/app.js"></script>
  </body>
</html>`);

const app = express();

app.use("/app", express.static(APP_PATH));

app.get("/", (_req: express.Request, res:express.Response) => {
  res.send(HTML_TEMPLATE({
    title: "Xapphire13"
  }));
});

app.listen(80);

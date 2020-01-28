import childProcess from "child_process";
import yargs from "yargs";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import User from "../src/server/entities/user";
import Post from "../src/server/entities/post";
import Log from "../src/server/entities/log";

const args = yargs
  .options({
    debug: {
      describe: "Run in debug mode",
      type: "boolean",
      default: false
    } as yargs.Options
  })
  .strict().argv;

async function seedDatabase(connectionUri: string) {
  const mongoClient = new MongoClient(connectionUri, { useUnifiedTopology: true });
  await mongoClient.connect();
  const db = mongoClient.db();

  // Create collections
  await db.createCollection<Log>("logs", { capped: true, max: 100, size: 1048576 });
  const postCollection = await db.createCollection<Post>("posts");
  const userCollection = await db.createCollection<User>("users");

  // Seed posts
  await postCollection.insertOne({
    _id: "deadbeef",
    createdAt: new Date(),
    lastModified: new Date(),
    isPublished: true,
    markdownText: "Testing!!",
    tags: ["test"],
    title: "Test"
  })

  // Seed users
  await userCollection.insertOne({
    name: "Bart Simpson",
    username: "Admin",
    authenticatorSecret: "EJK2JWLBYKUYQWM5", // Clear to reset 2FA
    passwordHash: "$2b$10$Ci91eC2eR3tUTA68aJFaUe7vWFhPUDklNLvG/KMQ85aP5tToxtbrG",
    tokenSecret: "",
    isAdmin: true,
  });
}

(async function run() {
  const tsc = childProcess.spawn("./node_modules/.bin/tsc", [
    "--watch",
    "-p",
    "./src/server"
  ]);
  const webpack = childProcess.spawn("./node_modules/.bin/webpack", [
    "--watch",
    "--config",
    "./webpack.dev.js"
  ]);

  const serverCompile = new Promise(resolve => {
    tsc.stdout.on("data", data => {
      const str = String(data).trim();

      if (str) {
        if (/Watching for file changes/.test(str)) {
          resolve();
        }

        str.split("\n").forEach(line => console.log(`[TSC] ${line}`));
      }
    });
  });

  const webpackCompile = new Promise(resolve => {
    webpack.stdout.on("data", data => {
      const str = String(data).trim();

      if (str) {
        if (/Built at:/.test(str)) {
          resolve();
        }

        str.split("\n").forEach(line => console.log(`[WEBPACK] ${line}`));
      }
    });
  });

  await Promise.all([serverCompile, webpackCompile]);

  // Start mongoDB
  const mongod = new MongoMemoryServer();
  const mongodUri = await mongod.getUri();
  console.log(`Started in memory MongoDB at: ${mongodUri}`);
  await seedDatabase(mongodUri);

  const nodemonArgs = ["--watch", "./dist", "--ignore", "./dist/app"];

  if (args.debug) {
    nodemonArgs.push("--inspect");
  }

  const nodemon = childProcess.spawn("./node_modules/.bin/nodemon", [
    ...nodemonArgs,
    "--exec",
    "heroku local",
    "--signal",
    "SIGTERM"
  ], {
    env: {
      ...process.env,
      MONGODB_URI: mongodUri
    }
  });

  nodemon.stdout.on("data", data => {
    const str = String(data).trim();

    if (str) {
      str.split("\n").forEach(line => console.log(`[NODEMON] ${line}`));
    }
  });
})();

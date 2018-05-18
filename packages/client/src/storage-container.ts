import {CrossStorageHub} from "cross-storage";
import ready = require("document-ready");

const ORIGIN = process.env.NODE_ENV === "production" ?
  /:\/\/(www\.)?xapphire13.com$/ :
  /127\.0\.0\.1$/;

ready(() => {
  CrossStorageHub.init([
    {origin: ORIGIN, allow: ["get", "set", "del", "getKeys", "clear"]}
  ]);
});

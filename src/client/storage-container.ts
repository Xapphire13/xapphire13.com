import { CrossStorageHub } from "cross-storage";
import ready from "document-ready";

const ORIGIN = process.env.NODE_ENV === "production" ?
  /:\/\/(www\.)?xapphire13(\.herokuapp)?\.com$/ :
  /(127\.0\.0\.1)|(localhost)/;

ready(() => {
  CrossStorageHub.init([
    { origin: ORIGIN, allow: ["get", "set", "del", "getKeys", "clear"] }
  ]);
});

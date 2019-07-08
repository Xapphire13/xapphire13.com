import * as path from "path";

export const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";
export const APP_PATH = path.resolve(__dirname, "./app");
export const PLAYGROUND_PATH = path.resolve(APP_PATH, "/playground");

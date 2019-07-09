import * as path from "path";

export const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";
export const APP_PATH = path.resolve(__dirname, "./app");

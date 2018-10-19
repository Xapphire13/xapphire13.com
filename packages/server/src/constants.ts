import * as path from "path";

export const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";
export const APP_PATH = path.resolve(__dirname, IS_DEVELOPMENT ? "../../../client/dist" : "../client");
export const PLAYGROUND_PATH = path.resolve(__dirname, "../playground");

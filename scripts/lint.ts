import {ROOT_PATH} from "./config";

import child_process from "child_process";
import globby from "globby";
import process from "process";

const NODE_BIN = child_process.execSync("npm bin", {encoding: "utf8"});

async function run(): Promise<void> {
  const tsPackages = await globby("packages/*/tsconfig.json", {cwd: ROOT_PATH});
  let errorsExist = false;

  for (const tsPackage of tsPackages) {
    console.log(`Linting ${tsPackage}`);

    try {
      child_process.execSync(
        `tslint -p "${tsPackage}"`,
        {
          stdio: "inherit",
          encoding: "utf8",
          cwd: ROOT_PATH,
          env: {PATH: `${process.env.PATH};${NODE_BIN}`}
        });
    } catch {
      errorsExist = true;
    }
  }

  if (errorsExist) {
    process.exit(1);
  }
}

run();

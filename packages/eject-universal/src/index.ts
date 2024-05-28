#!/usr/bin/env node

import { EjectScript } from "./script";
import { existsSync } from "fs-extra";
import { join } from "path";
import process from "process";
export type { EjectConfig as Config } from "./script";

async function main() {
  try {
    const configPath = join(process.cwd(), "starter-cli.config.js");

    if (!existsSync(configPath)) {
      console.error(
        "Config file not found! Make sure you have starter-cli.config.js in your project root directory." +
          "config path: " +
          configPath
      );
      process.exit(1);
    }

    console.info("Config file found! Reading config file...");

    const { config } = require(configPath);

    if (!config) {
      const errorJSON = {
        config: [
          {
            source: "path/to/source",
            target: "path/to/target",
          },
        ],
      };
      throw new Error(
        `Config not found in starter-cli.config.js! Please add\n module.exports = ${JSON.stringify(
          errorJSON,
          null,
          2
        )} \nto your config file.`
      );
    }

    console.info("Config file read successfully! Copying directories...");

    const ejectScript = new EjectScript(config);

    await ejectScript.run();

    console.info("Directories copied successfully!");
    // copyDirectoriesFromSourceToTarget(config);
  } catch (err) {
    console.error("Error: ", err);
  }
}

main();

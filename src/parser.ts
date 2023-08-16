import { existsSync, writeFileSync } from "node:fs";
import fetch from "node-fetch";
import { ensureFileSync } from "src/utils";
import { IS_DEBUGGING } from "src/constants";
import { logger } from "src/logger";

const log = logger({ file: "parser", isLogging: IS_DEBUGGING });

/**
 * parseNodeModuleCachePath
 * @description a convenience function to parse modules
 * @param {string} modulePath
 * @param {string} cachePath
 * @returns {string}
 */
export const parseNodeModuleCachePath = async (modulePath: string, cachePath: string) => {
  log.debug("parseNodeModuleCachePath", cachePath, modulePath);
  if (existsSync(cachePath)) return cachePath;
  try {
    const resp = await fetch(modulePath);
    if (!resp.ok) throw Error(`404: Module not found: ${modulePath}`);
    const code = await resp.text();
    ensureFileSync(cachePath);
    writeFileSync(cachePath, code);
    return cachePath;
  } catch (err) {
    log.error(`parseNodeModuleCachePath: Failed in parsing module ${err}`);
    return cachePath;
  }
};

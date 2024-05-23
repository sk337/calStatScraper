import { parse } from "hjson";
import { readFileSync } from "fs";
import { findPaths } from "./utils";

interface Localization {
  [key: string]: string;
}
interface LoadedLocalization {
  [key: string]: Localization;
}

function merge(
  obj1: LoadedLocalization,
  obj2: LoadedLocalization
): LoadedLocalization {
  const merged: LoadedLocalization = {};
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      merged[key] = obj1[key];
    }
  }
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      merged[key] = obj2[key];
    }
  }
  return merged;
}
class LocalizationHandler {
  paths: string[];
  localized: LoadedLocalization;

  constructor(localazationPath: string) {
    this.paths = findPaths(
      localazationPath,
      /Items\.(?!Potions|Armor)[a-zA-Z.]+\.hjson$/i
    );
    // console.log(this.paths);
    let basePath: LoadedLocalization = {};
    this.paths.forEach((path) => {
      const fc = readFileSync(path, "utf-8");
      const parsed = parse(fc);
      basePath = merge(basePath, parsed);
    });
    this.localized = basePath;
  }
  getLocalization(item: string): Localization {
    for (const key in this.localized) {
      if (key.includes(item)) {
        return this.localized[key];
      }
    }
    return {};
  }
}

export { LocalizationHandler };

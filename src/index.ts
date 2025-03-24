import { readFileSync, writeFileSync } from "fs";
import {
  findPaths,
  correctDamageType,
  speedToString,
  knockbackToString,
  parseTooltip,
  ParseRarity,
} from "./utils";
import { Weapon, Obtained, ItemType } from "../types";
import { LocalizationHandler } from "./LocalizationHandler";
import { Logger } from "./logger";
import axios from "axios";
import axiosRateLimit from "axios-rate-limit";

const logger = new Logger();

const localContent = new LocalizationHandler(
  "./CalamityModPublic/Localization/en-US",
);

const http = axiosRateLimit(axios.create(), {
  maxRequests: 2,
  perMilliseconds: 1000,
  maxRPS: 2,
});

const wikiOverides: { [key: string]: string } = {
  Thunderstorm: "Thunderstorm_(weapon)",
};

const badWeapons: {
  useTime: string[];
  damage: string[];
} = {
  useTime: [],
  damage: [],
};

function getstat(stats: string[], stat: string): string {
  for (let i = 0; i < stats.length; i++) {
    if (stats[i].includes(stat)) {
      return stats[i].split("=").splice(-2)[1].trim().replaceAll(/;/g, "");
    }
  }
  return "";
}

async function getStats(path: string): Promise<Weapon> {
  const fileContent = readFileSync(path, "utf-8");
  const statsRegex = fileContent.match(
    /SetDefaults\(\)[\w\W]*?}\n/gim,
  ) as string[];
  if (!statsRegex) {
    logger.warn(`Unable to find Stats`, path);
  }
  let obtained: Obtained = "Other";
  const canCraft = fileContent.match(/AddRecipes/) ? true : false;
  if (canCraft) {
    obtained = "Crafting";
  }
  if (statsRegex == null) {
    console.log(path);
  }
  const stats = statsRegex[0]
    .split("\n")
    .slice(2, -1)
    .map((stat) => stat.trim());

  // console.log(stats)
  const stdName = path.split("/").splice(-1)[0].replace(/.cs$/, "");
  // console.log(stdName);
  const localized = localContent.getLocalization(stdName);
  let fixStd = "";
  try {
    fixStd = localized.DisplayName.replace(/ /g, "_");
    if (wikiOverides[fixStd]) {
      logger.info("Overide found for", fixStd);
      // console.log("Overide found for " + fixStd);
      // console.log("===========");
      fixStd = wikiOverides[fixStd];
    }
  } catch (e) {
    console.error(localized, stdName);
    process.exit(1);
  }
  const imageBasePath = "https://calamitymod.wiki.gg/";
  const wikiBasePath =
    "https://calamitymod.wiki.gg/wiki/File:" + fixStd + ".png";
  const text = await http.get(wikiBasePath).then((res) => res.data);
  let imagePath = "";
  const matches = text.match(/images\/[^"]*\.png[^"]*"/g) as string[];
  if (matches == null) {
    logger.error(
      text,
      "No image found for",
      localized.DisplayName,
      localized,
      stdName,
      fixStd,
    );
    process.exit(1);
    imagePath = "";
  } else {
    const path2 = matches[0].slice(0, -1).replace(/\?[^"]*/, "");
    imagePath = imageBasePath + path2;
  }
  const rarity = ParseRarity(getstat(stats, "rare"), path, stats);
  let kb = parseFloat(getstat(stats, "knockBack").replaceAll(/f/g, ""));
  if (isNaN(kb)) {
    logger.warn("No knockback for", localized.DisplayName, "defaulting to 0");
    kb = 0;
  }
  let useTime = parseFloat(getstat(stats, "useTime"));
  let damage = parseFloat(getstat(stats, "damage"));
  if (isNaN(useTime)) {
    badWeapons.useTime.push(localized.DisplayName);
    logger.warn(
      "Could not parse useTime for",
      localized.DisplayName,
      "found:",
      useTime,
      getstat(stats, "useTime"),
    );
  }
  if (isNaN(damage)) {
    badWeapons.damage.push(localized.DisplayName);
    logger.warn(
      "Could not parse damage for",
      localized.DisplayName,
      "found:",
      damage,
      getstat(stats, "damage"),
    );
  }
  const finalStats = {
    name: localized.DisplayName,
    damage: damage,
    image: imagePath,
    damageType:
      getstat(stats, "DamageType") == ""
        ? "Classless"
        : correctDamageType(getstat(stats, "DamageType"), path),
    useTime: useTime,
    useTimeString: speedToString(parseInt(getstat(stats, "useTime"))),
    tooltip: localized.Tooltip ? parseTooltip(localized.Tooltip) : "",
    knockback: kb,
    knockbackString: knockbackToString(kb),
    obtained,
    source: "calamity" as ItemType,
    rarity,
  };
  return finalStats;
}

const weapons: Weapon[] = [];

const weaponPath = "./CalamityModPublic/Items/Weapons";
// let weaponPath = "./Weapons"

const forcePaths = [
  "./CalamityModPublic/Items/Tools/InfernaCutter.cs",
  "./CalamityModPublic/Items/Tools/Grax.cs",
  "./CalamityModPublic/Items/Fishing/BrimstoneCragCatches/DragoonDrizzlefish.cs",
];

const ignorePaths = ["RougeWeapon.cs", "Skynamite.cs"];

const fp = findPaths(weaponPath, /.*\.cs$/).concat(forcePaths);
for (let idx = 0; idx < fp.length; idx++) {
  const path = fp[idx];
  if (
    path.indexOf("RogueWeapon.cs") == -1 &&
    path.indexOf("Skynamite.cs") == -1
  ) {
    weapons.push(await getStats(path));
  }
}

console.log(weapons.length);

writeFileSync("weapons.json", JSON.stringify(weapons, null, 2));
writeFileSync("badWeapons.json", JSON.stringify(badWeapons, null, 2));

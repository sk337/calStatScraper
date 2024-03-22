import { readFileSync, writeFileSync } from "fs";
import {
  findPaths,
  correctDamageType,
  speedToString,
  knockbackToString,
  parseTooltip,
} from "./utils";
import { Weapon, Obtained, ItemType } from "../types";
import { LocalizationHandler } from "./LocalizationHandler";

const localContent = new LocalizationHandler(
  "./CalamityModPublic/Localization/en-US",
);

// const _imageOverrides = {
//   FourSeasonsGalaxia: "Galaxia.png",
// };

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
  const statsRegex = fileContent.match(/SetDefaults()[^}]*}/im) as string[];
  if (!statsRegex) {
    console.log(path);
  }
  let obtained: Obtained = "Other";
  const canCraft = fileContent.match(/AddRecipes/) ? true : false;
  if (canCraft) {
    obtained = "Crafting";
  }
  const stats = statsRegex[0]
    .split("\n")
    .slice(2, -1)
    .map((stat) => stat.trim())
    .filter(Boolean);

  // console.log(stats)
  const stdName = path.split("/").splice(-1)[0].replace(/.cs$/, "");
  const localized = localContent.getLocalization(stdName);
  let fixStd = "";
  try {
    fixStd = localized.DisplayName.replace(/ /g, "_");
  } catch (e) {
    console.log(localized, stdName);
    process.exit(1);
  }
  const imageBasePath = "https://calamitymod.wiki.gg/";
  const wikiBasePath =
    "https://calamitymod.wiki.gg/wiki/File:" + fixStd + ".png";
  const text = await fetch(wikiBasePath).then((req) => {
    return req.text();
  });
  let imagePath = "";
  const matches = text.match(/images\/[^"]*\.png"/g) as string[];
  if (matches == null) {
    console.log(localized, stdName);
    imagePath = "";
  } else {
    const path2 = matches[0].slice(0, -1);
    imagePath = imageBasePath + path2;
  }

  const finalStats = {
    name: localized.DisplayName,
    damage: parseInt(getstat(stats, "damage")),
    image: imagePath,
    damageType:
      getstat(stats, "DamageType") == ""
        ? "classless"
        : correctDamageType(getstat(stats, "DamageType")),
    useTime: parseInt(getstat(stats, "useTime")),
    useTimeString: speedToString(parseInt(getstat(stats, "useTime"))),
    tooltip: localized.Tooltip ? parseTooltip(localized.Tooltip) : "",
    knockback: parseInt(getstat(stats, "knockBack").replaceAll(/f/g, "")),
    knockbackString: knockbackToString(
      parseInt(getstat(stats, "knockBack").replaceAll(/f/g, "")),
    ),
    obtained,
    source: "calamity" as ItemType,
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

const fp = findPaths(weaponPath, /.*\.cs$/).concat(forcePaths);
for (let idx = 0; idx < fp.length; idx++) {
  const path = fp[idx];
  if (path.indexOf("RogueWeapon.cs") == -1) {
    weapons.push(await getStats(path));
  }
}

console.log(weapons.length);

writeFileSync("weapons.json", JSON.stringify(weapons, null, 2));

import { join } from "path";
import { readdirSync, statSync } from "fs";
import { DamageType, Knockback, UseTime } from "../types";

function findPaths(basePath: string, regex: RegExp): string[] {
  let foundPaths: string[] = [];
  const paths = readdirSync(basePath);

  for (const path of paths) {
    const fullPath = join(basePath, path);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      foundPaths = foundPaths.concat(findPaths(fullPath, regex));
    } else if (stats.isFile() && regex.test(fullPath)) {
      foundPaths.push(fullPath);
    }
  }

  return foundPaths;
}

function knockbackToString(knockback: number): Knockback {
  if (knockback <= 0) {
    return "No Knockback";
  } else if (knockback <= 1.5) {
    return "Extremely weak knockback";
  } else if (knockback <= 3) {
    return "Very weak knockback";
  } else if (knockback <= 4) {
    return "Weak knockback";
  } else if (knockback <= 6) {
    return "Average knockback";
  } else if (knockback <= 7) {
    return "Strong knockback";
  } else if (knockback <= 9) {
    return "Very strong knockback";
  } else if (knockback <= 11) {
    return "Extremely strong knockback";
  } else {
    return "Insane knockback";
  }
}

function speedToString(speed: number): UseTime {
  if (speed <= 8) {
    return "Insanely fast";
  } else if (speed <= 20) {
    return "Very fast";
  } else if (speed <= 25) {
    return "Fast";
  } else if (speed <= 30) {
    return "Average";
  } else if (speed <= 35) {
    return "Slow";
  } else if (speed <= 45) {
    return "Very slow";
  } else if (speed <= 55) {
    return "Extremely slow";
  } else {
    return "Snail";
  }
}

function correctDamageType(damageype: string): DamageType {
  const damageType = damageype.split(".")[1];
  if (damageType == "Melee" || damageType == "MeleeNoSpeed") {
    return "Melee";
  } else if (damageType == "Ranged") {
    return "Ranged";
  } else if (damageType == "Magic") {
    return "Magic";
  } else if (damageType == "Summon") {
    return "Summon";
  } else if (damageType == "Rogue" || damageType == "Throwing") {
    return "Rogue";
  } else if (damageType == "Instance") {
    const damage = damageype.split(".")[0];
    if (damage == "RogueDamageClass") {
      return "Rogue";
    } else if (damage == "TrueMeleeDamageClass") {
      return "Melee";
    } else if (damage == "TrueMeleeNoSpeedDamageClass") {
      return "Melee";
    } else if (damage == "AverageDamageClass") {
      return "Classless";
    }

    console.log(damageype);
    return "Melee";
  } else {
    console.log(damageype);
    return "Melee";
  }
}

function parseTooltip(tooltip: string): string {
  const regex = /\[c\/([0-9A-Fa-f]{6}):'([^'\]]*)('|\])/g;

  const result = tooltip.replace(regex, (_match, _hexValue, stringValue) => {
    return stringValue;
  });
  if (result.includes("[")) {
    return result.split("[")[0] + result.split(":")[1];
  }
  return result;
}

export {
  findPaths,
  knockbackToString,
  speedToString,
  correctDamageType,
  parseTooltip,
};
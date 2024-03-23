type Knockback =
  | "No Knockback"
  | "Extremely weak knockback"
  | "Very weak knockback"
  | "Weak knockback"
  | "Average knockback"
  | "Strong knockback"
  | "Very strong knockback"
  | "Extremely strong knockback"
  | "Insane knockback";

const KnockbackGuess = {
  "No Knockback": 0,
  "Extremely weak knockback": 1.5,
  "Very weak knockback": 3,
  "Weak knockback": 4,
  "Average knockback": 6,
  "Strong knockback": 7,
  "Very strong knockback": 9,
  "Extremely strong knockback": 11,
  "Insane knockback": 12,
};

type UseTime =
  | "Insanely fast"
  | "Very fast"
  | "Fast"
  | "Average"
  | "Slow"
  | "Very slow"
  | "Extremely slow"
  | "Snail";

const UseTimeGuess = {
  "Insanely fast": 8,
  "Very fast": 20,
  Fast: 25,
  Average: 30,
  Slow: 35,
  "Very slow": 45,
  "Extremely slow": 55,
  Snail: 65,
};

type DamageType =
  | "Melee"
  | "Ranged"
  | "Magic"
  | "Summon"
  | "Rogue"
  | "Classless";

type Rarity =
  | "Grey"
  | "White"
  | "Blue"
  | "Green"
  | "Orange"
  | "Light Red"
  | "Pink"
  | "Light Purple"
  | "Lime"
  | "Yellow"
  | "Cyan"
  | "Red"
  | "Purple"
  | "Turquoise"
  | "Pure Green"
  | "Dark Blue"
  | "Violet"
  | "Hot Pink"
  | "Calamity Red"
  | "Dark Orange"
  | "Rainbow";

type Obtained = "Crafting" | "Other";

type ItemType = "calamity" | "vanilla";

interface Weapon {
  name: string;
  image: string;
  tooltip: string;
  damage: number;
  damageType: DamageType;
  useTime?: number;
  useTimeString: UseTime;
  knockback?: number;
  knockbackString: Knockback;
  obtained: Obtained;
  source: ItemType;
  rarity: Rarity;
}

interface externalWeapon {
  id: string;
  name: string;
  autoswing: boolean;
  damage: string;
  knockback: Knockback;
  speed: UseTime;
  damageType: DamageType;
  tooltip: string[];
  obtained: Obtained[];
}

export {
  Knockback,
  UseTime,
  DamageType,
  Obtained,
  ItemType,
  Weapon,
  externalWeapon,
  Rarity,
  KnockbackGuess,
  UseTimeGuess,
};

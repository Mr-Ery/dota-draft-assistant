import { readFile, mkdir, writeFile } from "node:fs/promises";

const database = JSON.parse(await readFile("data/hero-database-7.41c.json", "utf8"));

const canonicalRoleOverrides = {
  "anti-mage": ["Position 1"],
  "arc-warden": ["Position 1", "Position 2"],
  "alchemist": ["Position 1", "Position 2"],
  "bloodseeker": ["Position 1", "Position 3"],
  "chaos-knight": ["Position 1", "Position 3"],
  "clinkz": ["Position 1", "Position 2"],
  "drow-ranger": ["Position 1"],
  "faceless-void": ["Position 1"],
  "gyrocopter": ["Position 1"],
  "juggernaut": ["Position 1"],
  "lifestealer": ["Position 1"],
  "lone-druid": ["Position 1", "Position 2"],
  "luna": ["Position 1"],
  "medusa": ["Position 1", "Position 2"],
  "monkey-king": ["Position 1", "Position 2"],
  "morphling": ["Position 1", "Position 2"],
  "muerta": ["Position 1", "Position 2"],
  "naga-siren": ["Position 1"],
  "phantom-assassin": ["Position 1"],
  "phantom-lancer": ["Position 1"],
  "riki": ["Position 1", "Position 4"],
  "slark": ["Position 1"],
  "sniper": ["Position 1", "Position 2"],
  "spectre": ["Position 1"],
  "sven": ["Position 1"],
  "templar-assassin": ["Position 1", "Position 2"],
  "terrorblade": ["Position 1"],
  "tiny": ["Position 1", "Position 2"],
  "troll-warlord": ["Position 1"],
  "ursa": ["Position 1"],
  "weaver": ["Position 1", "Position 3"],
  "wraith-king": ["Position 1", "Position 3"],

  "death-prophet": ["Position 2", "Position 3"],
  "leshrac": ["Position 2", "Position 3"],
  "puck": ["Position 2"],
  "queen-of-pain": ["Position 2"],
  "storm-spirit": ["Position 2"],
  "invoker": ["Position 2"],
  "lina": ["Position 2", "Position 1"],
  "tinker": ["Position 2"],
  "void-spirit": ["Position 2"],
  "ember-spirit": ["Position 2"],
  "huskar": ["Position 2"],
  "kunkka": ["Position 2", "Position 3"],
  "meepo": ["Position 2"],
  "shadow-fiend": ["Position 2"],
  "zeus": ["Position 2"],

  "axe": ["Position 3"],
  "beastmaster": ["Position 3"],
  "brewmaster": ["Position 3"],
  "bristleback": ["Position 3"],
  "centaur-warrunner": ["Position 3"],
  "dark-seer": ["Position 3"],
  "dawnbreaker": ["Position 3"],
  "doom": ["Position 3"],
  "dragon-knight": ["Position 2", "Position 3"],
  "enigma": ["Position 3", "Position 4"],
  "legion-commander": ["Position 3"],
  "lycan": ["Position 3", "Position 1"],
  "magnus": ["Position 3", "Position 2"],
  "mars": ["Position 3"],
  "night-stalker": ["Position 3"],
  "primal-beast": ["Position 3", "Position 2"],
  "sand-king": ["Position 3"],
  "slardar": ["Position 3"],
  "tidehunter": ["Position 3"],
  "timbersaw": ["Position 3"],
  "underlord": ["Position 3"],
  "venomancer": ["Position 3", "Position 4"],
  "viper": ["Position 3", "Position 2"],

  "bounty-hunter": ["Position 4"],
  "clockwerk": ["Position 4", "Position 3"],
  "dark-willow": ["Position 4", "Position 5"],
  "earth-spirit": ["Position 4"],
  "earthshaker": ["Position 4", "Position 3"],
  "elder-titan": ["Position 4", "Position 5"],
  "hoodwink": ["Position 4"],
  "marci": ["Position 4", "Position 3"],
  "mirana": ["Position 4"],
  "nyx-assassin": ["Position 4"],
  "pangolier": ["Position 2", "Position 3"],
  "pudge": ["Position 4", "Position 3"],
  "rubick": ["Position 4"],
  "snapfire": ["Position 4", "Position 5"],
  "spirit-breaker": ["Position 4", "Position 3"],
  "techies": ["Position 4", "Position 5"],
  "tusk": ["Position 4"],
  "windranger": ["Position 2", "Position 4"],

  "abaddon": ["Position 5", "Position 3"],
  "ancient-apparition": ["Position 5"],
  "bane": ["Position 5"],
  "chen": ["Position 5"],
  "crystal-maiden": ["Position 5"],
  "dazzle": ["Position 5"],
  "disruptor": ["Position 5", "Position 4"],
  "enchantress": ["Position 5", "Position 4"],
  "grimstroke": ["Position 5", "Position 4"],
  "io": ["Position 5", "Position 4"],
  "jakiro": ["Position 5", "Position 4"],
  "keeper-of-the-light": ["Position 5", "Position 4"],
  "lich": ["Position 5"],
  "lion": ["Position 5", "Position 4"],
  "natures-prophet": ["Position 4", "Position 3"],
  "necrophos": ["Position 3", "Position 2"],
  "ogre-magi": ["Position 5", "Position 4"],
  "omniknight": ["Position 5", "Position 3"],
  "oracle": ["Position 5"],
  "phoenix": ["Position 5", "Position 4"],
  "shadow-demon": ["Position 5", "Position 4"],
  "shadow-shaman": ["Position 5", "Position 4"],
  "silencer": ["Position 5", "Position 4"],
  "skywrath-mage": ["Position 4", "Position 5"],
  "treant-protector": ["Position 5"],
  "undying": ["Position 5", "Position 3"],
  "vengeful-spirit": ["Position 5", "Position 4"],
  "visage": ["Position 3", "Position 4"],
  "warlock": ["Position 5"],
  "winter-wyvern": ["Position 5", "Position 4"],
  "witch-doctor": ["Position 5"]
};

const heroes = database.heroes.map((hero) => ({
  name: hero.name,
  roles: mapRoles(hero),
  damage: inferDamage(hero.primaryAttr, hero.roles),
  tags: inferTags(hero),
  vulnerableTo: inferVulnerabilities(hero),
  answers: inferAnswers(hero),
  patchScore: 5,
  summary: heroSummary(hero)
}));

await mkdir("src/generated", { recursive: true });
await writeFile(
  "src/generated/hero-catalog.js",
  `// Generated by scripts/generate-hero-catalog.mjs from data/hero-database-7.41c.json.\nexport const GENERATED_HEROES = ${JSON.stringify(heroes, null, 2)};\n`
);

console.log(`Generated ${heroes.length} heroes in src/generated/hero-catalog.js`);

function mapRoles(hero) {
  const override = canonicalRoleOverrides[nameKey(hero.name)];
  if (override) return override;

  const set = new Set();
  if (hero.roles.includes("Durable") || hero.roles.includes("Initiator")) set.add("Position 3");
  if (hero.roles.includes("Support")) set.add("Position 4");
  if (hero.roles.includes("Support")) set.add("Position 5");
  if (!set.size && hero.roles.includes("Carry")) set.add(hero.attackType === "Melee" ? "Position 2" : "Position 1");
  if (!set.size) set.add(hero.attackType === "Melee" ? "Position 3" : "Position 2");
  return [...set].slice(0, 3);
}

function inferDamage(primaryAttr, roles) {
  if (roles.includes("Nuker")) return "magical";
  if (primaryAttr === "agi" || roles.includes("Carry")) return "physical";
  return "mixed";
}

function inferTags(hero) {
  const tags = new Set();
  for (const role of hero.roles) {
    if (role === "Carry") tags.add("scaling");
    if (role === "Support") tags.add("warding");
    if (role === "Nuker") tags.add("burst");
    if (role === "Disabler") tags.add("disable");
    if (role === "Durable") tags.add("frontline");
    if (role === "Escape") tags.add("mobility");
    if (role === "Pusher") tags.add("tower");
    if (role === "Initiator") tags.add("initiation");
  }
  if (hero.attackType === "Ranged") tags.add("ranged-poke");
  if (hero.primaryAttr === "agi") tags.add("physical");
  if (hero.primaryAttr === "int") tags.add("magical");
  if (!tags.size) tags.add("tempo");
  return [...tags];
}

function inferVulnerabilities(hero) {
  const tags = new Set();
  if (hero.roles.includes("Escape")) tags.add("silence");
  if (hero.roles.includes("Carry")) tags.add("disable");
  if (hero.attackType === "Ranged") tags.add("gap-close");
  if (!hero.roles.includes("Durable")) tags.add("burst");
  return [...tags];
}

function inferAnswers(hero) {
  const answers = new Set();
  if (hero.roles.includes("Disabler")) answers.add("mobility");
  if (hero.roles.includes("Nuker")) answers.add("low-hp");
  if (hero.roles.includes("Pusher")) answers.add("weak-lanes");
  if (hero.roles.includes("Initiator")) answers.add("low-mobility");
  if (hero.roles.includes("Durable")) answers.add("physical");
  return [...answers];
}

function heroSummary(hero) {
  const roles = mapRoles(hero).map((role) => role.replace("Position ", "P")).join("/");
  const identity = [];
  if (hero.roles.includes("Carry")) identity.push("scaling");
  if (hero.roles.includes("Nuker")) identity.push("burst");
  if (hero.roles.includes("Disabler")) identity.push("control");
  if (hero.roles.includes("Pusher")) identity.push("objective pressure");
  if (hero.roles.includes("Durable")) identity.push("frontline");
  if (hero.roles.includes("Support")) identity.push("utility");
  const text = identity.length ? identity.join(", ") : "tempo";
  return `${hero.name} is a ${roles} option built around ${text}; item and advice output changes with enemy picks.`;
}

function nameKey(name) {
  return name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

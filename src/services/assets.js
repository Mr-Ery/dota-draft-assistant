const heroSlugOverrides = {
  "Anti-Mage": "anti_mage",
  "Centaur Warrunner": "centaur",
  "Clockwerk": "rattletrap",
  "Doom": "doom_bringer",
  "Drow Ranger": "drow_ranger",
  "Faceless Void": "faceless_void",
  "Io": "wisp",
  "Lifestealer": "life_stealer",
  "Monkey King": "monkey_king",
  "Nature's Prophet": "furion",
  "Outworld Destroyer": "obsidian_destroyer",
  "Phantom Assassin": "phantom_assassin",
  "Phantom Lancer": "phantom_lancer",
  "Queen of Pain": "queenofpain",
  "Shadow Demon": "shadow_demon",
  "Shadow Shaman": "shadow_shaman",
  "Skywrath Mage": "skywrath_mage",
  "Spirit Breaker": "spirit_breaker",
  "Storm Spirit": "storm_spirit",
  "Templar Assassin": "templar_assassin",
  "Timbersaw": "shredder",
  "Treant Protector": "treant",
  "Underlord": "abyssal_underlord",
  "Vengeful Spirit": "vengefulspirit",
  "Windranger": "windrunner",
  "Wraith King": "skeleton_king",
  "Witch Doctor": "witch_doctor"
};

const legacyHeroSlugOverrides = {
  "Anti-Mage": "antimage",
  "Clockwerk": "rattletrap",
  "Doom": "doom_bringer",
  "Io": "wisp",
  "Lifestealer": "life_stealer",
  "Nature's Prophet": "furion",
  "Necrophos": "necrolyte",
  "Outworld Destroyer": "obsidian_destroyer",
  "Queen of Pain": "queenofpain",
  "Timbersaw": "shredder",
  "Treant Protector": "treant",
  "Underlord": "abyssal_underlord",
  "Vengeful Spirit": "vengefulspirit",
  "Windranger": "windrunner",
  "Wraith King": "skeleton_king"
};

const itemSlugOverrides = {
  battle_fury: "bfury",
  branches: "branches",
  blink: "blink",
  linkens_sphere: "sphere",
  pipe: "pipe",
  assault: "assault",
  sheepstick: "sheepstick"
};

const abilityOverrides = {
  "Anti-Mage": ["anti_mage_mana_break", "anti_mage_blink", "anti_mage_counterspell", "anti_mage_mana_void"],
  "Axe": ["axe_berserkers_call", "axe_battle_hunger", "axe_counter_helix", "axe_culling_blade"],
  "Doom": ["doom_bringer_devour", "doom_bringer_scorched_earth", "doom_bringer_infernal_blade", "doom_bringer_doom"],
  "Mars": ["mars_spear", "mars_gods_rebuke", "mars_bulwark", "mars_arena_of_blood"],
  "Puck": ["puck_illusory_orb", "puck_waning_rift", "puck_phase_shift", "puck_dream_coil"],
  "Razor": ["razor_plasma_field", "razor_static_link", "razor_unstable_current", "razor_eye_of_the_storm"],
  "Spirit Breaker": ["spirit_breaker_charge_of_darkness", "spirit_breaker_bulldoze", "spirit_breaker_greater_bash", "spirit_breaker_nether_strike"],
  "Underlord": ["abyssal_underlord_firestorm", "abyssal_underlord_pit_of_malice", "abyssal_underlord_atrophy_aura", "abyssal_underlord_dark_portal"]
};

export function heroSlug(name) {
  return heroSlugOverrides[name] || name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function legacyHeroSlug(name) {
  return legacyHeroSlugOverrides[name] || heroSlug(name);
}

export function heroPortrait(name) {
  return heroPortraitCandidates(name)[0];
}

export function heroProfile(name) {
  return heroProfileCandidates(name)[0];
}

export function abilityIcon(ability) {
  return abilityIconCandidates(ability)[0];
}

export function itemIcon(itemSlug) {
  return itemIconCandidates(itemSlug)[0];
}

export function heroAbilities(name) {
  return abilityOverrides[name] || [];
}

export function heroPortraitCandidates(name) {
  const modern = heroSlug(name);
  const legacy = legacyHeroSlug(name);
  return unique([
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${modern}.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${legacy}_full.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${legacy}_lg.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${legacy}_sb.png`
  ]);
}

export function heroProfileCandidates(name) {
  const modern = heroSlug(name);
  const legacy = legacyHeroSlug(name);
  return unique([
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${modern}_vert.jpg`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${modern}.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${legacy}_full.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${legacy}_lg.png`
  ]);
}

export function abilityIconCandidates(ability) {
  return [
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability}.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/abilities/${ability}_lg.png`
  ];
}

export function itemIconCandidates(itemSlug) {
  const slug = itemSlugOverrides[itemSlug] || itemSlug;
  return unique([
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${slug}.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${itemSlug}.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${slug}_lg.png`,
    `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/items/${itemSlug}_lg.png`
  ]);
}

export function fallbackAttribute(urls) {
  return urls.slice(1).join("|");
}

export function dotabuffHeroUrl(name) {
  return `https://www.dotabuff.com/heroes/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function dota2ProTrackerHeroUrl(name) {
  return `https://dota2protracker.com/hero/${encodeURIComponent(name)}`;
}

function unique(items) {
  return [...new Set(items)];
}

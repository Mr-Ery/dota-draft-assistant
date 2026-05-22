import { getHero } from "../engine/recommendation-engine.js";
import { archetypeForHero } from "../data/hero-build-archetypes.js";

const itemText = {
  tango: "Sustain the first waves.",
  branches: "Cheap stats for trading.",
  quelling_blade: "Secure early last hits.",
  magic_stick: "Punish spell-heavy lanes.",
  magic_wand: "Burst sustain against frequent spell casts.",
  bracer: "Early durability for brawling.",
  wraith_band: "Efficient agility lane stats.",
  null_talisman: "Mana and spell-pressure stats.",
  bottle: "Rune control and rotation sustain.",
  boots: "Basic positioning and lane tempo.",
  phase_boots: "Armor, chase, and trading.",
  power_treads: "Stat switching, farming speed, and fighting efficiency.",
  arcane_boots: "Mana sustain for spell-heavy tempo.",
  tranquil_boots: "Low-cost roaming sustain.",
  travel_boots: "Map pressure and split-push tempo.",
  blink: "Primary initiation or catch timing.",
  blademail: "Punish right-click and burst commits.",
  vanguard: "Stabilize into physical lane pressure.",
  crimson_guard: "Reduce summon, illusion, and physical chip damage.",
  pipe: "Team protection against magic burst.",
  black_king_bar: "Commit safely into disables and burst.",
  force_staff: "Save, reposition, and break traps.",
  glimmer_cape: "Cheap save against magic damage.",
  aether_lens: "Cast from safer range.",
  veil_of_discord: "Amplify magic burst windows.",
  spirit_vessel: "Anti-heal and tempo damage.",
  euls: "Dispel, setup, and defensive reset.",
  lotus_orb: "Dispel silences and reflect targeted spells.",
  linkens_sphere: "Block one key single-target disable.",
  manta: "Dispel, split-push, and illusion pressure.",
  sange_and_yasha: "Status resistance and sustained fighting.",
  diffusal_blade: "Mana burn, chase, and illusion pressure.",
  disperser: "Late-game dispel, chase, and movement reset.",
  battle_fury: "Greedy farming acceleration.",
  maelstrom: "Farm speed and magic proc damage.",
  mjollnir: "Anti-illusion and high attack-speed scaling.",
  butterfly: "Late physical damage and evasion.",
  eye_of_skadi: "Anti-heal, anti-kite, and late-game stats.",
  heart: "Frontline durability and illusion sustain.",
  satanic: "Stand ground in late fights.",
  assault: "Team armor and objective pressure.",
  desolator: "Accelerate kills, towers, and Roshan.",
  basher: "Lock down mobile cores.",
  abyssal_blade: "Reliable late-game BKB-piercing lockdown.",
  monkey_king_bar: "Damage through evasion.",
  silver_edge: "Break passives and start pickoffs.",
  orchid: "Early silence for mobile or spell-reliant cores.",
  bloodthorn: "Late silence, burst, and true strike pressure.",
  daedalus: "Raw physical damage spike.",
  radiance: "Tempo aura damage and illusion pressure.",
  armlet: "Early all-in strength timing.",
  heaven_halberd: "Disarm dangerous right-clickers.",
  shivas_guard: "Armor, vision, and anti-heal.",
  refresher: "Double decisive teamfight spells.",
  sheepstick: "Late-game hard catch.",
  guardian_greaves: "Team sustain, dispel, and aura timing.",
  mekansm: "Early group sustain.",
  holy_locket: "Amplify heals and saves.",
  solar_crest: "Buff your carry or punish armor.",
  pavise: "Protect a core during physical burst.",
  boots_of_bearing: "Team tempo, chase, and disengage.",
  aghanim_scepter: "Hero-specific spell upgrade timing.",
  ultimate_scepter: "Hero-specific spell upgrade timing.",
  shard: "Important hero-specific shard timing.",
  nullifier: "Remove defensive items and punish saves.",
  mage_slayer: "Reduce spell burst from high-magic cores.",
  dragon_lance: "Range, stats, and safer tower hitting.",
  hurricane_pike: "Range plus defensive repositioning.",
  echo_sabre: "Early burst and mana sustain.",
  harpoon: "Catch and force short-range fights.",
  kaya_and_sange: "Spell scaling plus status resistance.",
  kaya_and_yasha: "Spell tempo and movement speed.",
  octarine_core: "Cooldown reduction for constant spell output.",
  ethereal_blade: "Magic burst and physical protection.",
  dagon: "Pickoff burst."
};

const heroProfiles = {
  "Anti-Mage": build(["tango", "branches", "quelling_blade"], ["magic_wand", "power_treads"], ["battle_fury"], ["manta", "butterfly", "abyssal_blade"], ["black_king_bar", "linkens_sphere", "skadiAlias", "nullifier"], ["satanic", "disperser"], "AM needs Battle Fury/Manta tempo unless the game demands earlier fighting."),
  "Axe": build(["tango", "branches", "quelling_blade"], ["bracer", "vanguard", "phase_boots"], ["blink", "blademail"], ["black_king_bar", "shivas_guard"], ["pipe", "crimson_guard", "lotus_orb"], ["refresher", "heart"], "Axe is about blink timing, punishing carries, and surviving counter-initiation."),
  "Beastmaster": build(["tango", "branches", "quelling_blade"], ["bracer", "boots"], ["helm_of_the_dominator", "ancient_janggo"], ["blink", "black_king_bar", "assault"], ["pipe", "heaven_halberd", "lotus_orb"], ["refresher"], "Beastmaster wants objective tempo and aura pressure."),
  "Centaur Warrunner": build(["tango", "branches", "quelling_blade"], ["bracer", "vanguard", "phase_boots"], ["blink"], ["pipe", "crimson_guard", "heart"], ["lotus_orb", "heaven_halberd", "shivas_guard"], ["refresher"], "Centaur builds to start fights and absorb the first enemy burst."),
  "Crystal Maiden": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["glimmer_cape", "force_staff"], ["black_king_bar", "shard"], ["ghost", "aether_lens", "pavise"], ["sheepstick"], "CM needs cheap positioning/survival because her spells are strong but she is fragile."),
  "Dark Seer": build(["tango", "branches"], ["bracer", "arcane_boots"], ["guardian_greaves"], ["pipe", "blink", "shivas_guard"], ["lotus_orb", "crimson_guard", "aghanim_scepter"], ["refresher"], "Dark Seer itemizes for aura timing and teamfight spell layering."),
  "Dazzle": build(["tango", "branches", "magic_stick"], ["boots", "arcane_boots"], ["holy_locket", "glimmer_cape"], ["force_staff", "guardian_greaves"], ["aether_lens", "lotus_orb", "sheepstick"], ["refresher"], "Dazzle prioritizes heal amplification, saves, and cast range."),
  "Doom": build(["tango", "branches", "quelling_blade"], ["bracer", "phase_boots"], ["blink", "black_king_bar"], ["shivas_guard", "refresher"], ["pipe", "lotus_orb", "heaven_halberd"], ["sheepstick"], "Doom needs one clean initiation and enough durability to cast Doom."),
  "Drow Ranger": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["dragon_lance"], ["manta", "hurricane_pike", "black_king_bar"], ["butterfly", "silver_edge", "monkey_king_bar"], ["satanic", "daedalus"], "Drow builds range and defensive spacing before pure damage."),
  "Faceless Void": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["maelstrom"], ["manta", "black_king_bar", "mjollnir"], ["butterfly", "satanic", "silver_edge"], ["refresher", "abyssal_blade"], "Void balances farm speed with Chronosphere fighting windows."),
  "Grimstroke": build(["tango", "branches", "magic_stick"], ["boots", "arcane_boots"], ["aether_lens", "glimmer_cape"], ["force_staff", "aghanim_scepter"], ["lotus_orb", "spirit_vessel", "sheepstick"], ["refresher"], "Grimstroke values cast range and items that protect Soulbind positioning."),
  "Hoodwink": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["maelstrom", "force_staff"], ["aether_lens", "gleipnir"], ["spirit_vessel", "lotus_orb", "blink"], ["sheepstick"], "Hoodwink scales through catch range and pickoff tempo."),
  "Huskar": build(["tango", "branches"], ["bracer", "armlet", "phase_boots"], ["black_king_bar"], ["aghanim_scepter", "satanic"], ["heaven_halberd", "silver_edge", "lotus_orb"], ["assault"], "Huskar's build is timing-based: armlet into BKB/Roshan pressure."),
  "Invoker": build(["tango", "branches", "null_talisman"], ["bottle", "boots"], ["midas", "travel_boots"], ["black_king_bar", "blink"], ["sheepstick", "refresher", "linkens_sphere"], ["octarine_core"], "Invoker changes heavily by game, but needs tempo, mana, and spell access."),
  "Io": build(["tango", "branches"], ["magic_wand", "tranquil_boots"], ["holy_locket", "mekansm"], ["guardian_greaves", "glimmer_cape"], ["force_staff", "solar_crest", "lotus_orb"], ["heart"], "Io builds around keeping the chosen core alive."),
  "Jakiro": build(["tango", "branches", "magic_stick"], ["boots", "arcane_boots"], ["mekansm", "force_staff"], ["aether_lens", "guardian_greaves"], ["glimmer_cape", "shivas_guard", "sheepstick"], ["refresher"], "Jakiro wants mana, cast range, and teamfight uptime."),
  "Juggernaut": build(["tango", "branches", "quelling_blade"], ["wraith_band", "phase_boots"], ["maelstrom"], ["manta", "aghanim_scepter", "butterfly"], ["black_king_bar", "skadiAlias", "basher"], ["abyssal_blade", "satanic"], "Juggernaut builds around safe fighting, dispel, and Omnislash damage."),
  "Lifestealer": build(["tango", "branches", "quelling_blade"], ["bracer", "phase_boots"], ["armlet", "desolator"], ["sange_and_yasha", "basher"], ["assault", "heaven_halberd", "silver_edge"], ["abyssal_blade", "satanic"], "Lifestealer wants early manfight stats and anti-frontline damage."),
  "Lina": build(["tango", "branches", "null_talisman"], ["bottle", "boots"], ["maelstrom", "black_king_bar"], ["silver_edge", "satanic"], ["monkey_king_bar", "linkens_sphere", "hurricane_pike"], ["daedalus"], "Core Lina builds farm speed into right-click scaling and BKB."),
  "Luna": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["mask_of_madness", "dragon_lance"], ["manta", "black_king_bar", "butterfly"], ["satanic", "skadiAlias", "silver_edge"], ["daedalus"], "Luna needs farm acceleration and then objective-safe teamfight items."),
  "Magnus": build(["tango", "branches", "quelling_blade"], ["bracer", "arcane_boots"], ["blink"], ["black_king_bar", "refresher"], ["force_staff", "lotus_orb", "pipe"], ["sheepstick"], "Magnus is defined by Blink/BKB/Refresher teamfight timings."),
  "Mars": build(["tango", "branches", "quelling_blade"], ["bracer", "phase_boots"], ["blink"], ["black_king_bar", "desolator"], ["pipe", "lotus_orb", "shivas_guard"], ["refresher"], "Mars needs initiation timing, then either damage or aura defense."),
  "Medusa": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["manta"], ["butterfly", "skadiAlias", "satanic"], ["linkens_sphere", "black_king_bar", "mjollnir"], ["rapier"], "Medusa is a hard-scaling stat core; avoid generic carry builds."),
  "Mirana": build(["tango", "branches", "magic_stick"], ["boots", "urn_of_shadows"], ["spirit_vessel", "force_staff"], ["aether_lens", "euls"], ["lotus_orb", "solar_crest", "sheepstick"], ["refresher"], "Mirana wants setup, tempo, and utility rather than generic damage."),
  "Monkey King": build(["tango", "branches", "quelling_blade"], ["orb_of_corrosion", "phase_boots"], ["echo_sabre", "black_king_bar"], ["desolator", "basher"], ["skadiAlias", "silver_edge", "monkey_king_bar"], ["abyssal_blade"], "Monkey King builds to win skirmishes and turn Wukong fights."),
  "Oracle": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["aether_lens", "glimmer_cape"], ["force_staff", "holy_locket"], ["lotus_orb", "aeon_disk", "ghost"], ["sheepstick"], "Oracle needs cast range and survival to keep False Promise available."),
  "Phantom Assassin": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["battle_fury", "black_king_bar"], ["desolator", "basher"], ["satanic", "skadiAlias", "monkey_king_bar"], ["abyssal_blade"], "PA needs a farm/damage timing, then BKB and lockdown."),
  "Phantom Lancer": build(["tango", "branches", "quelling_blade"], ["magic_wand", "power_treads"], ["diffusal_blade"], ["manta", "aghanim_scepter", "heart"], ["skadiAlias", "disperser", "butterfly"], ["bloodthorn", "abyssal_blade"], "PL is illusion/chase based: Diffusal, Manta, Aghanim, Skadi/Heart are far more natural than one generic carry build."),
  "Phoenix": build(["tango", "branches", "magic_stick"], ["tranquil_boots", "urn_of_shadows"], ["spirit_vessel", "veil_of_discord"], ["shivas_guard", "lotus_orb"], ["heaven_halberd", "refresher", "guardian_greaves"], ["sheepstick"], "Phoenix itemizes for egg protection, anti-heal, and teamfight aura value."),
  "Puck": build(["tango", "branches", "null_talisman"], ["bottle", "power_treads"], ["witch_blade", "blink"], ["kaya_and_sange", "black_king_bar"], ["euls", "linkens_sphere", "sheepstick"], ["octarine_core"], "Puck changes by disable threat: tempo damage first, defensive dispel when needed."),
  "Queen of Pain": build(["tango", "branches", "null_talisman"], ["bottle", "power_treads"], ["kaya_and_sange", "black_king_bar"], ["aghanim_scepter", "shivas_guard"], ["linkens_sphere", "orchid", "sheepstick"], ["refresher"], "QoP needs lane tempo, spell damage, and survivability into disables."),
  "Razor": build(["tango", "branches", "quelling_blade"], ["bracer", "phase_boots"], ["black_king_bar"], ["sange_and_yasha", "shivas_guard"], ["pipe", "heaven_halberd", "refresher"], ["assault"], "Razor builds around long fights and surviving while Static Link wins damage trades."),
  "Rubick": build(["tango", "branches", "magic_stick"], ["boots", "arcane_boots"], ["aether_lens", "blink"], ["force_staff", "glimmer_cape"], ["aghanim_scepter", "lotus_orb", "sheepstick"], ["refresher"], "Rubick needs cast range and positioning to steal/cast high-value spells."),
  "Shadow Demon": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["aether_lens", "glimmer_cape"], ["force_staff", "aghanim_scepter"], ["lotus_orb", "spirit_vessel", "ghost"], ["sheepstick"], "Shadow Demon builds around save range, purge value, and disruption setup."),
  "Shadow Shaman": build(["tango", "branches", "magic_stick"], ["boots", "arcane_boots"], ["blink", "aether_lens"], ["force_staff", "shard"], ["glimmer_cape", "black_king_bar", "refresher"], ["sheepstick"], "Shaman needs positioning to land disables and convert wards into objectives."),
  "Skywrath Mage": build(["tango", "branches", "null_talisman"], ["boots", "arcane_boots"], ["veil_of_discord", "rod_of_atos"], ["aether_lens", "force_staff"], ["glimmer_cape", "sheepstick", "ethereal_blade"], ["dagon"], "Skywrath builds around silence plus burst windows."),
  "Slark": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["diffusal_blade"], ["aghanim_scepter", "black_king_bar"], ["basher", "skadiAlias", "silver_edge"], ["abyssal_blade", "butterfly"], "Slark wants chase, dispel, and lockdown against escape heroes."),
  "Snapfire": build(["tango", "branches", "magic_stick"], ["boots", "arcane_boots"], ["force_staff", "mekansm"], ["aether_lens", "aghanim_scepter"], ["shivas_guard", "lotus_orb", "blink"], ["refresher"], "Snapfire itemizes around long-range follow-up and save utility."),
  "Sniper": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["dragon_lance", "maelstrom"], ["hurricane_pike", "black_king_bar"], ["silver_edge", "monkey_king_bar", "satanic"], ["daedalus"], "Sniper must solve positioning before committing to glass-cannon damage."),
  "Spectre": build(["tango", "branches", "quelling_blade"], ["wraith_band", "power_treads"], ["blademail", "radiance"], ["manta", "heart"], ["skadiAlias", "butterfly", "nullifier"], ["abyssal_blade"], "Spectre builds to survive early, then abuse global fights and tanky scaling."),
  "Spirit Breaker": build(["tango", "branches", "magic_stick"], ["bracer", "phase_boots"], ["spirit_vessel", "shadow_blade"], ["black_king_bar", "lotus_orb"], ["heaven_halberd", "pipe", "assault"], ["silver_edge"], "Spirit Breaker wants map tempo, survivability, and anti-core utility."),
  "Storm Spirit": build(["tango", "branches", "null_talisman"], ["bottle", "power_treads"], ["orchid", "kaya_and_sange"], ["black_king_bar", "linkens_sphere"], ["sheepstick", "bloodthorn", "shivas_guard"], ["refresher"], "Storm's build changes sharply based on silence and mana-burn threats."),
  "Templar Assassin": build(["tango", "branches", "slippers"], ["bottle", "power_treads"], ["desolator", "blink"], ["black_king_bar", "dragon_lance"], ["hurricane_pike", "monkey_king_bar", "nullifier"], ["daedalus"], "TA hits Desolator/Blink/Roshan timings, then adapts to evasion and control."),
  "Tidehunter": build(["tango", "branches", "quelling_blade"], ["bracer", "arcane_boots"], ["blink", "mekansm"], ["guardian_greaves", "pipe"], ["shivas_guard", "lotus_orb", "refresher"], ["sheepstick"], "Tide builds to survive lane and deliver Ravage/Refresher fights."),
  "Tiny": build(["tango", "branches", "quelling_blade"], ["bracer", "phase_boots"], ["blink", "echo_sabre"], ["black_king_bar", "assault"], ["silver_edge", "harpoon", "crystalis"], ["daedalus"], "Tiny wants blink burst and tower/objective damage."),
  "Treant Protector": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["solar_crest", "glimmer_cape"], ["blink", "guardian_greaves"], ["force_staff", "lotus_orb", "refresher"], ["sheepstick"], "Treant values saves, tower protection, and Overgrowth positioning."),
  "Underlord": build(["tango", "branches", "quelling_blade"], ["bracer", "arcane_boots"], ["vanguard", "guardian_greaves"], ["pipe", "crimson_guard"], ["lotus_orb", "shivas_guard", "heaven_halberd"], ["refresher"], "Underlord is an aura/control offlaner, especially good into illusion and physical lineups."),
  "Ursa": build(["tango", "branches", "quelling_blade"], ["orb_of_corrosion", "phase_boots"], ["blink", "basher"], ["black_king_bar", "aghanim_scepter"], ["abyssal_blade", "satanic", "skadiAlias"], ["butterfly"], "Ursa wants Roshan and jump timings, then lockdown to finish targets."),
  "Vengeful Spirit": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["solar_crest", "force_staff"], ["aghanim_scepter", "glimmer_cape"], ["lotus_orb", "hurricane_pike", "sheepstick"], ["assault"], "Venge builds around save, aura damage, and physical draft amplification."),
  "Witch Doctor": build(["tango", "branches", "magic_stick"], ["boots", "arcane_boots"], ["glimmer_cape", "shard"], ["force_staff", "aether_lens"], ["black_king_bar", "aghanim_scepter", "ghost"], ["refresher"], "Witch Doctor needs positioning and survival to channel high-value Death Ward.")
};

const roleFallbacks = {
  "Position 1": build(["tango", "branches", "quelling_blade"], ["magic_wand", "power_treads"], ["maelstrom"], ["manta", "black_king_bar"], ["butterfly", "satanic"], ["abyssal_blade"], "Fallback carry build; prefer hero-specific profile when available."),
  "Position 2": build(["tango", "branches", "null_talisman"], ["bottle", "boots"], ["kaya_and_sange"], ["black_king_bar", "blink"], ["linkens_sphere", "sheepstick"], ["refresher"], "Fallback mid build; adapt to rune control and enemy disables."),
  "Position 3": build(["tango", "branches", "quelling_blade"], ["bracer", "phase_boots"], ["blink"], ["black_king_bar", "pipe"], ["lotus_orb", "shivas_guard"], ["refresher"], "Fallback offlane build; adapt to damage type and initiation needs."),
  "Position 4": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["force_staff"], ["glimmer_cape", "aether_lens"], ["lotus_orb", "sheepstick"], ["refresher"], "Fallback soft-support build; adapt to save/catch needs."),
  "Position 5": build(["tango", "branches", "magic_stick"], ["boots", "tranquil_boots"], ["glimmer_cape"], ["force_staff", "holy_locket"], ["lotus_orb", "aether_lens"], ["sheepstick"], "Fallback hard-support build; adapt to survival and save needs.")
};

const alias = {
  skadiAlias: "eye_of_skadi",
  ancient_janggo: "boots_of_bearing",
  ultimate_scepter: "aghanim_scepter",
  ghost: "ghost",
  aeon_disk: "aeon_disk",
  rod_of_atos: "rod_of_atos",
  gleipnir: "gleipnir",
  helm_of_the_dominator: "helm_of_the_dominator",
  mask_of_madness: "mask_of_madness",
  midas: "hand_of_midas",
  witch_blade: "witch_blade",
  urn_of_shadows: "urn_of_shadows",
  orb_of_corrosion: "orb_of_corrosion",
  slippers: "slippers",
  shadow_blade: "shadow_blade",
  crystalis: "crystalis",
  rapier: "rapier"
};

export function itemBuild(hero, role, draft = {}) {
  const profile = cloneProfile(heroProfiles[hero.name] || profileFromArchetype(hero.name) || roleFallbacks[role]);
  const enemyHeroes = (draft.enemies || []).map(getHero).filter(Boolean);
  const context = analyzeEnemies(enemyHeroes);
  const adjustments = matchupAdjustments(hero, context, draft);

  for (const adjustment of adjustments) {
    const target = profile[adjustment.phase] || profile.situational;
    for (const item of adjustment.items) {
      if (!hasItem(profile, item)) target.push(item);
    }
  }

  return phaseOrder.map((phase, phaseIndex) => ({
    phase,
    timing: timings[phaseIndex],
    headline: phaseHeadline(phase, profile, context),
    items: profile[phase].map(resolveItem).map((slug) => ({
      slug,
      name: titleItem(slug),
      note: noteFor(slug, hero, context, adjustments)
    })),
    reason: phaseReason(phase, hero, context, profile)
  }));
}

export function buildSummary(hero, role, draft = {}) {
  const profile = heroProfiles[hero.name] || profileFromArchetype(hero.name) || roleFallbacks[role];
  const context = analyzeEnemies((draft.enemies || []).map(getHero).filter(Boolean));
  const lines = [profile.identity];
  if (context.hasSilence) lines.push("Enemy silence means dispel/BKB/Linken timing matters more.");
  if (context.hasIllusions) lines.push("Enemy illusions increase the value of AoE, Crimson, Mjollnir, or wave-clear items.");
  if (context.hasHighMagic) lines.push("Enemy magic burst increases BKB, Pipe, Mage Slayer, or Glimmer priority.");
  if (context.hasEvasion) lines.push("Enemy evasion increases Monkey King Bar or Bloodthorn priority.");
  if (context.hasHealing) lines.push("Enemy sustain increases Skadi, Shiva, Vessel, or anti-heal priority.");
  return lines.slice(0, 4);
}

export function criticalItemsForGame(hero, role, draft = {}) {
  const context = analyzeEnemies((draft.enemies || []).map(getHero).filter(Boolean));
  const required = [];
  if (context.hasSilence || context.hasCatch) {
    if (["Position 1", "Position 2"].includes(role)) required.push(requiredItem("black_king_bar", "Required if fights are decided by silence, stun chains, or burst initiation."));
    if (hero.tags.includes("scaling") || hero.vulnerableTo.includes("silence")) required.push(requiredItem("manta", "Strong dispel option when enemy control is silence/root based."));
    required.push(requiredItem("linkens_sphere", "Consider it when one single-target spell starts the enemy kill chain."));
  }
  if (context.hasHighMagic) {
    if (["Position 3", "Position 4", "Position 5"].includes(role)) required.push(requiredItem("pipe", "Important team item against heavy magic damage."));
    if (["Position 4", "Position 5"].includes(role)) required.push(requiredItem("glimmer_cape", "Cheap save against magic burst and targeted jumps."));
  }
  if (context.hasPhysical) {
    if (role === "Position 3") required.push(requiredItem("crimson_guard", "Important against physical pressure, summons, or illusion chip damage."));
    if (["Position 4", "Position 5"].includes(role)) required.push(requiredItem("pavise", "Cheap save when enemy physical burst threatens your core."));
    if (["Position 1", "Position 2"].includes(role)) required.push(requiredItem("butterfly", "Late defensive damage item if enemy lacks reliable true strike."));
  }
  if (context.hasIllusions) {
    if (["Position 1", "Position 2"].includes(role)) required.push(requiredItem("mjollnir", "Best carry-side answer when illusion waves must be cleared quickly."));
    required.push(requiredItem("shivas_guard", "Armor, anti-heal, and AoE control against illusion or summon pressure."));
  }
  if (context.hasHealing) {
    if (["Position 1", "Position 2"].includes(role)) required.push(requiredItem("eye_of_skadi", "High priority against healing, lifesteal, and long sustain fights."));
    required.push(requiredItem("spirit_vessel", "Team needs one Vessel if enemy regen/heal is the core problem."));
  }
  if (context.hasEvasion) {
    required.push(requiredItem("monkey_king_bar", "Needed when evasion prevents your physical damage from connecting."));
  }
  if (!required.length) {
    required.push(requiredItem("black_king_bar", "Default safety item if enemy disable or burst becomes the main issue."));
  }
  return dedupeRequired(required).slice(0, 6).map((item) => ({
    ...item,
    name: titleItem(item.slug)
  }));
}

function build(starting, lane, early, core, situational, luxury, identity) {
  return { starting, lane, early, core, situational, luxury, identity };
}

function profileFromArchetype(heroName) {
  const archetype = archetypeForHero(heroName);
  if (!archetype) return null;
  return build(
    ["tango", "branches", "magic_stick"],
    ["boots"],
    archetype.defaultItems.slice(0, 1),
    archetype.defaultItems.slice(1, 3),
    archetype.defaultItems.slice(3),
    ["sheepstick", "refresher"],
    archetype.coreIdea
  );
}

const phaseOrder = ["starting", "lane", "early", "core", "situational", "luxury"];
const timings = ["0:00", "2-7 min", "7-12 min", "12-24 min", "as needed", "late game"];

function analyzeEnemies(enemies) {
  const tags = new Set(enemies.flatMap((hero) => hero.tags));
  const names = new Set(enemies.map((hero) => hero.name));
  return {
    enemies,
    tags,
    names,
    hasSilence: tags.has("silence") || names.has("Doom") || names.has("Skywrath Mage"),
    hasIllusions: tags.has("illusion") || names.has("Phantom Lancer") || names.has("Naga Siren") || names.has("Terrorblade"),
    hasHighMagic: [...tags].some((tag) => ["burst", "magical", "teamfight", "damage-over-time"].includes(tag)),
    hasPhysical: tags.has("physical") || tags.has("anti-carry") || tags.has("ranged-poke"),
    hasCatch: tags.has("catch") || tags.has("disable") || tags.has("initiation"),
    hasEvasion: names.has("Phantom Assassin") || names.has("Butterfly"),
    hasHealing: tags.has("sustain") || tags.has("save"),
    hasManaBurn: tags.has("mana-burn") || names.has("Anti-Mage"),
    hasSplitPush: tags.has("split-push"),
    hasFrontline: tags.has("frontline")
  };
}

function matchupAdjustments(hero, context, draft) {
  const items = [];
  if (context.hasSilence && hero.vulnerableTo.includes("silence")) {
    items.push(adjust("situational", ["black_king_bar", "linkens_sphere", "lotus_orb"], "silence answer"));
  }
  if (context.hasHighMagic) {
    if (draft.role === "Position 3") items.push(adjust("situational", ["pipe"], "magic lineup answer"));
    if (["Position 4", "Position 5"].includes(draft.role)) items.push(adjust("core", ["glimmer_cape"], "magic save answer"));
    if (["Position 1", "Position 2"].includes(draft.role)) items.push(adjust("core", ["black_king_bar"], "magic burst answer"));
  }
  if (context.hasPhysical) {
    if (draft.role === "Position 3") items.push(adjust("situational", ["crimson_guard", "shivas_guard"], "physical lineup answer"));
    if (["Position 4", "Position 5"].includes(draft.role)) items.push(adjust("situational", ["pavise", "solar_crest"], "physical save answer"));
  }
  if (context.hasIllusions) {
    if (hero.name === "Phantom Lancer") items.push(adjust("situational", ["heart", "butterfly"], "illusion mirror scaling"));
    else if (["Position 1", "Position 2"].includes(draft.role)) items.push(adjust("situational", ["mjollnir"], "illusion clear answer"));
    else items.push(adjust("situational", ["crimson_guard", "shivas_guard"], "illusion pressure answer"));
  }
  if (context.hasEvasion) {
    items.push(adjust("situational", ["monkey_king_bar", "bloodthorn"], "evasion answer"));
  }
  if (context.hasHealing) {
    if (["Position 1", "Position 2"].includes(draft.role)) items.push(adjust("situational", ["eye_of_skadi"], "anti-heal answer"));
    else items.push(adjust("situational", ["spirit_vessel", "shivas_guard"], "anti-heal answer"));
  }
  if (context.hasCatch && ["Position 1", "Position 2"].includes(draft.role)) {
    items.push(adjust("situational", ["manta", "black_king_bar", "linkens_sphere"], "catch/dispel answer"));
  }
  if (context.hasSplitPush && ["Position 2", "Position 3", "Position 4"].includes(draft.role)) {
    items.push(adjust("situational", ["travel_boots", "sheepstick"], "split-push catch answer"));
  }
  return items;
}

function adjust(phase, items, reason) {
  return { phase, items, reason };
}

function requiredItem(slug, reason) {
  return { slug, reason };
}

function dedupeRequired(items) {
  const bySlug = new Map();
  for (const item of items) if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
  return [...bySlug.values()];
}

function cloneProfile(profile) {
  return Object.fromEntries(Object.entries(profile).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]));
}

function hasItem(profile, item) {
  const slug = resolveItem(item);
  return phaseOrder.some((phase) => profile[phase].map(resolveItem).includes(slug));
}

function resolveItem(item) {
  return alias[item] || item;
}

function noteFor(slug, hero, context, adjustments) {
  const triggered = adjustments.find((adjustment) => adjustment.items.map(resolveItem).includes(slug));
  if (triggered) return `${itemText[slug] || "Adaptive matchup item."} Added because of ${triggered.reason}.`;
  if (hero.name === "Phantom Lancer" && ["diffusal_blade", "manta", "aghanim_scepter", "eye_of_skadi", "heart"].includes(slug)) {
    return `${itemText[slug]} This is core to PL's illusion/chase identity, matching Dotabuff-style hero item trends.`;
  }
  if (context.hasManaBurn && slug === "linkens_sphere") return "Protects against key single-target openings in mana-pressure games.";
  return itemText[slug] || "Hero-specific timing item.";
}

function phaseReason(phase, hero, context, profile) {
  const enemyNames = context.enemies.map((enemy) => enemy.name).join(", ") || "the current enemy draft";
  const pressure = pressureLabel(context);
  if (phase === "starting") return `${hero.name} starts for its own lane pattern into ${enemyNames}, not from a generic role template.`;
  if (phase === "lane") return context.hasHighMagic ? `Lane items account for spell pressure from ${enemyNames}.` : `Lane items support ${hero.name}'s first stable timing against ${pressure}.`;
  if (phase === "early") return profile.identity;
  if (phase === "core") return `${hero.name}'s core is selected from its hero profile, then adjusted for ${pressure}.`;
  if (phase === "situational") return `Situational items are chosen because ${enemyNames} changes the disable, damage, sustain, illusion, or evasion problem.`;
  return `Luxury items convert the game after ${hero.name} has solved ${pressure}.`;
}

function phaseHeadline(phase, profile, context) {
  if (phase === "situational" && (context.hasSilence || context.hasIllusions || context.hasHighMagic || context.hasEvasion)) {
    return "Matchup-dependent";
  }
  return profile.identity;
}

function titleItem(slug) {
  const names = {
    black_king_bar: "Black King Bar",
    eye_of_skadi: "Eye of Skadi",
    diffusal_blade: "Diffusal Blade",
    butterfly: "Butterfly",
    aghanim_scepter: "Aghanim's Scepter",
    aether_lens: "Aether Lens",
    arcane_boots: "Arcane Boots",
    phase_boots: "Phase Boots",
    power_treads: "Power Treads",
    magic_wand: "Magic Wand",
    magic_stick: "Magic Stick",
    force_staff: "Force Staff",
    glimmer_cape: "Glimmer Cape",
    monkey_king_bar: "Monkey King Bar",
    linkens_sphere: "Linken's Sphere",
    shivas_guard: "Shiva's Guard",
    crimson_guard: "Crimson Guard",
    lotus_orb: "Lotus Orb",
    heaven_halberd: "Heaven's Halberd",
    boots_of_bearing: "Boots of Bearing",
    hand_of_midas: "Hand of Midas",
    mask_of_madness: "Mask of Madness",
    helm_of_the_dominator: "Helm of the Dominator",
    orb_of_corrosion: "Orb of Corrosion",
    witch_blade: "Witch Blade",
    urn_of_shadows: "Urn of Shadows",
    rod_of_atos: "Rod of Atos",
    aeon_disk: "Aeon Disk",
    travel_boots: "Boots of Travel"
  };
  return names[slug] || slug.split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function pressureLabel(context) {
  const parts = [];
  if (context.hasSilence) parts.push("silence");
  if (context.hasIllusions) parts.push("illusions");
  if (context.hasHighMagic) parts.push("magic burst");
  if (context.hasPhysical) parts.push("physical pressure");
  if (context.hasHealing) parts.push("sustain");
  if (context.hasSplitPush) parts.push("split-push");
  return parts.length ? parts.join(" + ") : "the visible enemy draft";
}

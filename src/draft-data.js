import { GENERATED_HEROES } from "./generated/hero-catalog.js";

export const philosophies = [
  {
    id: "enemy",
    label: "Enemy Picks Only",
    description: "Fast counter recommendations from enemy heroes, enemy counters, and enemy lineup weaknesses."
  },
  {
    id: "full",
    label: "Full Team Draft Analysis",
    description: "Advanced recommendations using allied synergy, enemy counters, lane interactions, timings, and composition balance."
  }
];

export const roles = [
  { id: "Position 1", title: "Carry" },
  { id: "Position 2", title: "Mid" },
  { id: "Position 3", title: "Offlane" },
  { id: "Position 4", title: "Soft Support" },
  { id: "Position 5", title: "Hard Support" }
];

export const laneTypes = [
  "kill lanes",
  "sustain lanes",
  "defensive lanes",
  "poke lanes",
  "scaling lanes",
  "push lanes",
  "all-in lanes",
  "anti-carry lanes",
  "tower control lanes"
];

const CURATED_HEROES = [
  hero("Anti-Mage", ["Position 1"], "physical", ["scaling", "split-push", "mobility", "mana-burn"], ["lockdown", "silence", "burst"], ["disable", "tempo"], 5, "Greedy scaling carry that punishes mana-dependent lineups."),
  hero("Axe", ["Position 3"], "physical", ["frontline", "initiation", "anti-carry", "disable", "catch"], ["ranged-poke", "save"], ["illusion", "melee"], 8, "Blink timing punishes fragile carries and clustered fights."),
  hero("Beastmaster", ["Position 3"], "mixed", ["tower", "vision", "disable", "tempo", "roshan"], ["wave-clear"], ["greedy", "low-mobility"], 7, "Objective offlaner with vision and reliable single-target control."),
  hero("Centaur Warrunner", ["Position 3"], "magical", ["frontline", "initiation", "mobility", "teamfight"], ["break", "mana-burn"], ["low-mobility", "physical"], 7, "Durable initiator that gives the team a clean fight start."),
  hero("Clockwerk", ["Position 4", "Position 3"], "physical", ["roam", "initiation", "catch", "frontline"], ["save", "force"], ["backline", "low-mobility"], 7, "Hookshot support that isolates backline heroes and starts fights."),
  hero("Crystal Maiden", ["Position 5"], "magical", ["disable", "sustain", "kill-lane", "warding"], ["gap-close"], ["melee", "low-mobility"], 6, "Reliable lane lockdown and mana sustain."),
  hero("Dark Seer", ["Position 3"], "magical", ["teamfight", "tempo", "wave-clear", "frontline"], ["dispel"], ["melee", "illusion"], 7, "Creates brutal timing combinations with mobile allies."),
  hero("Dazzle", ["Position 5"], "magical", ["save", "sustain", "scaling", "warding"], ["burst", "silence"], ["poke", "physical"], 5, "Sustain and save support for scaling lanes."),
  hero("Doom", ["Position 3"], "mixed", ["frontline", "disable", "initiation", "anti-carry", "scaling"], ["kite"], ["spell-reliant", "save"], 7, "Deletes one core from the fight and scales with farm."),
  hero("Drow Ranger", ["Position 1"], "physical", ["tower", "scaling", "ranged-poke", "physical"], ["gap-close", "illusion"], ["low-armor", "melee"], 6, "Pressure carry with strong ranged aura timings."),
  hero("Faceless Void", ["Position 1"], "physical", ["teamfight", "scaling", "initiation"], ["lane-pressure"], ["low-mobility"], 6, "Late-game teamfight carry built around Chronosphere execution."),
  hero("Grimstroke", ["Position 4", "Position 5"], "magical", ["disable", "teamfight", "kill-lane", "save"], ["dispel"], ["single-target"], 7, "Doubles single-target spells and enables aggressive lanes."),
  hero("Hoodwink", ["Position 4"], "physical", ["roam", "disable", "burst", "catch"], ["gap-close"], ["low-mobility"], 7, "Long-range soft support that chains disables from tree lines."),
  hero("Huskar", ["Position 2"], "magical", ["tempo", "roshan", "sustain", "lane-pressure"], ["break", "physical-burst"], ["low-burst", "greedy"], 5, "Snowball mid that punishes low-burst lanes."),
  hero("Enigma", ["Position 3", "Position 4"], "magical", ["teamfight", "disable", "push", "initiation"], ["silence", "cancel"], ["clustered"], 6, "Threatens lanes with summons and decides fights with Black Hole."),
  hero("Io", ["Position 4", "Position 5"], "magical", ["save", "sustain", "mobility", "scaling"], ["burst", "silence"], ["scaling"], 6, "Tether support that amplifies carries and enables global saves."),
  hero("Invoker", ["Position 2"], "mixed", ["teamfight", "burst", "tempo", "scaling"], ["silence", "gap-close"], ["low-mobility"], 7, "Flexible mid with strong combo and rotation windows."),
  hero("Jakiro", ["Position 4", "Position 5"], "magical", ["tower", "poke", "teamfight", "disable"], ["mobility"], ["melee", "low-range"], 8, "Lane bully with tower pressure and zone control."),
  hero("Juggernaut", ["Position 1"], "physical", ["kill-lane", "sustain", "scaling", "roshan"], ["pierce-bkb"], ["low-armor"], 6, "Safe carry that converts lockdown into early kills."),
  hero("Lifestealer", ["Position 1"], "physical", ["sustain", "anti-carry", "roshan", "scaling"], ["kite", "illusion"], ["frontline", "magical"], 6, "Durable carry with strong infest initiation pairings."),
  hero("Lina", ["Position 2"], "magical", ["burst", "lane-pressure", "tempo", "tower"], ["gap-close"], ["low-hp"], 7, "High-tempo mid with wave clear and burst."),
  hero("Luna", ["Position 1"], "mixed", ["tower", "scaling", "teamfight", "roshan"], ["illusion-clear", "gap-close"], ["weak-lanes"], 6, "Fast farmer with early objective conversion."),
  hero("Magnus", ["Position 3", "Position 2"], "physical", ["teamfight", "initiation", "frontline", "scaling"], ["disengage"], ["clustered"], 7, "Empower and Reverse Polarity create explosive carry timings."),
  hero("Mars", ["Position 3"], "physical", ["frontline", "initiation", "teamfight", "disable"], ["save", "mobility"], ["low-mobility", "ranged"], 8, "Arena controls fights and enables spell combos."),
  hero("Medusa", ["Position 1", "Position 2"], "physical", ["scaling", "frontline", "teamfight"], ["mana-burn", "tempo"], ["low-damage"], 4, "Hard scaling core that demands protection and time."),
  hero("Mirana", ["Position 4"], "magical", ["roam", "disable", "mobility", "catch"], ["dispel"], ["setup-dependent"], 7, "Roaming support that converts setup into long stuns."),
  hero("Monkey King", ["Position 1", "Position 2"], "physical", ["kill-lane", "mobility", "teamfight", "lane-pressure"], ["burst", "tree-cut"], ["melee"], 6, "Dominant laner with strong skirmish control."),
  hero("Oracle", ["Position 5"], "magical", ["save", "sustain", "dispel", "warding"], ["silence"], ["magic-burst"], 6, "Premier save support for high-commitment cores."),
  hero("Phantom Assassin", ["Position 1"], "physical", ["scaling", "burst", "roshan"], ["break", "magic-burst"], ["low-armor"], 6, "Explosive physical carry that loves empower and saves."),
  hero("Phantom Lancer", ["Position 1"], "physical", ["illusion", "scaling", "split-push"], ["aoe", "wave-clear"], ["single-target"], 5, "Illusion carry that strains weak wave-clear drafts."),
  hero("Phoenix", ["Position 4", "Position 5"], "magical", ["teamfight", "sustain", "save", "damage-over-time"], ["attack-speed"], ["clustered"], 7, "Teamfight support that punishes committed brawls."),
  hero("Puck", ["Position 2"], "magical", ["mobility", "catch", "silence", "tempo"], ["instant-disable"], ["predictable-spells", "low-mobility"], 8, "Mobile tempo mid with rune control and catch."),
  hero("Queen of Pain", ["Position 2"], "magical", ["mobility", "burst", "tempo", "rune"], ["silence"], ["low-mobility"], 7, "Pressures immobile mids and rotates early."),
  hero("Razor", ["Position 3", "Position 2"], "mixed", ["anti-carry", "lane-pressure", "frontline", "tempo"], ["burst", "kite"], ["melee", "physical"], 7, "Drains carry damage and wins long lane trades."),
  hero("Rubick", ["Position 4"], "magical", ["disable", "save", "roam", "teamfight"], ["burst"], ["spell-reliant"], 7, "Flexible soft support with strong counter-initiation."),
  hero("Shadow Demon", ["Position 4", "Position 5"], "magical", ["save", "disable", "illusion", "setup"], ["gap-close"], ["single-core"], 7, "Disruption saves allies and amplifies illusion-based timings."),
  hero("Shadow Shaman", ["Position 4", "Position 5"], "magical", ["disable", "tower", "kill-lane", "catch"], ["burst"], ["low-mobility"], 6, "Lockdown support with direct objective threat."),
  hero("Skywrath Mage", ["Position 4", "Position 5"], "magical", ["burst", "silence", "kill-lane", "roam"], ["dispel", "gap-close"], ["low-hp"], 6, "High burst support that punishes low-save drafts."),
  hero("Slark", ["Position 1"], "physical", ["scaling", "mobility", "anti-carry", "vision"], ["aoe-disable", "burst"], ["low-disable"], 6, "Snowball carry that exploits low lockdown."),
  hero("Snapfire", ["Position 4", "Position 5"], "magical", ["teamfight", "burst", "save", "poke"], ["gap-close"], ["arena-control"], 7, "Long-range teamfight follow-up and lane burst."),
  hero("Sniper", ["Position 2", "Position 1"], "physical", ["ranged-poke", "tower", "scaling"], ["gap-close", "mobility"], ["low-reach"], 5, "Long-range damage core vulnerable to hard catch."),
  hero("Spectre", ["Position 1"], "physical", ["scaling", "global", "frontline"], ["break", "tempo"], ["low-damage"], 5, "Global scaling carry that needs stable lanes."),
  hero("Spirit Breaker", ["Position 4", "Position 3"], "physical", ["roam", "initiation", "catch", "frontline"], ["save"], ["split-push", "low-mobility"], 8, "Map pressure support/offlaner with global catch."),
  hero("Storm Spirit", ["Position 2"], "magical", ["mobility", "burst", "catch", "scaling"], ["silence", "mana-burn"], ["backline"], 6, "Mobile mid that picks apart low-disable lineups."),
  hero("Templar Assassin", ["Position 2"], "physical", ["roshan", "burst", "tempo", "tower"], ["damage-over-time", "illusion"], ["weak-ranged", "low-armor"], 6, "Fast-farming mid with Roshan and tower timing."),
  hero("Tidehunter", ["Position 3"], "physical", ["frontline", "teamfight", "initiation", "dispel"], ["break"], ["clustered"], 7, "Stable aura carrier with huge fight reset."),
  hero("Tiny", ["Position 2", "Position 1"], "physical", ["burst", "tower", "initiation", "combo"], ["kite"], ["low-armor"], 6, "Burst and building damage core with Io-style timings."),
  hero("Treant Protector", ["Position 5"], "magical", ["sustain", "save", "teamfight", "warding"], ["dispel"], ["push"], 6, "Defensive support that stabilizes lanes and protects towers."),
  hero("Underlord", ["Position 3"], "magical", ["frontline", "tower", "wave-clear", "anti-carry"], ["break", "mobility"], ["melee", "illusion"], 7, "Controls zones, lanes, and map movement."),
  hero("Ursa", ["Position 1"], "physical", ["kill-lane", "roshan", "anti-carry", "burst"], ["kite", "disarm"], ["frontline"], 6, "Roshan carry that punishes durable melee cores."),
  hero("Vengeful Spirit", ["Position 4", "Position 5"], "physical", ["save", "disable", "tower", "kill-lane"], ["illusion"], ["low-armor"], 7, "Aura support that protects cores and amplifies physical pushes."),
  hero("Witch Doctor", ["Position 5"], "magical", ["kill-lane", "sustain", "burst", "warding"], ["dispel", "gap-close"], ["low-mobility"], 6, "High damage lane support with sustain and stun setup.")
];

export const HEROES = mergeHeroes(CURATED_HEROES, GENERATED_HEROES);

export const COMBOS = [
  combo(["Magnus", "Phantom Assassin"], 16, "Empower accelerates PA and RP creates clean crit windows."),
  combo(["Faceless Void", "Invoker"], 15, "Chronosphere guarantees Invoker spell layering."),
  combo(["Io", "Tiny"], 15, "Classic relocate burst and tower timing combo."),
  combo(["Oracle", "Huskar"], 16, "False Promise protects Huskar through deep all-ins."),
  combo(["Phoenix", "Mars"], 15, "Arena protects Supernova and traps targets in damage zones."),
  combo(["Dark Seer", "Spirit Breaker"], 14, "Ion Shell plus Charge creates constant map pressure."),
  combo(["Grimstroke", "Doom"], 15, "Soulbind can double Doom's fight-winning silence."),
  combo(["Enigma", "Skywrath Mage"], 13, "Black Hole setup guarantees Skywrath burst."),
  combo(["Shadow Demon", "Luna"], 13, "Disruption illusions amplify Luna objective timings."),
  combo(["Clockwerk", "Skywrath Mage"], 14, "Hookshot and Cogs hold targets for Mystic Flare."),
  combo(["Juggernaut", "Crystal Maiden"], 12, "Frostbite plus Blade Fury creates a direct kill lane."),
  combo(["Slark", "Shadow Shaman"], 12, "Long disables let Slark steal stacks and finish kills."),
  combo(["Ursa", "Witch Doctor"], 12, "Maledict and Fury Swipes punish any overextension."),
  combo(["Drow Ranger", "Vengeful Spirit"], 12, "Physical aura and stun pressure create lane and tower threat."),
  combo(["Monkey King", "Jakiro"], 11, "Harass, slows, and Jingu pressure make a strong all-in lane."),
  combo(["Tidehunter", "Snapfire"], 12, "Ravage holds targets inside Mortimer Kisses."),
  combo(["Centaur Warrunner", "Hoodwink"], 11, "Stomp setup and long-range follow-up create reliable pickoffs."),
  combo(["Razor", "Skywrath Mage"], 11, "Static Link plus silence/burst pressures weak carries."),
  combo(["Underlord", "Mirana"], 11, "Pit of Malice gives Arrow and tower-control follow-up."),
  combo(["Axe", "Rubick"], 10, "Call setup lets Rubick layer control and counter-initiate.")
];

export const COUNTERS = {
  "Anti-Mage": {
    "Axe": matchup(13, 8, 4, "Blink Call punishes AM before he can freely split-push."),
    "Doom": matchup(12, 5, 5, "Doom removes AM's escape and late-fight impact."),
    "Razor": matchup(10, 6, 4, "Static Link pressures AM's weak early damage."),
    "Puck": matchup(8, 4, 3, "Coil and silence restrict AM's mobility windows.")
  },
  "Crystal Maiden": {
    "Puck": matchup(9, 6, 3, "Mobility and silence punish CM's fragile positioning."),
    "Spirit Breaker": matchup(8, 5, 3, "Global pressure reaches CM before fights stabilize."),
    "Queen of Pain": matchup(7, 5, 2, "Blink burst picks off CM's backline position.")
  },
  "Phantom Lancer": {
    "Axe": matchup(14, 8, 5, "Berserker's Call and spin punish illusion clusters."),
    "Underlord": matchup(11, 7, 4, "Firestorm and aura control pressure PL waves."),
    "Lina": matchup(9, 5, 3, "Burst and wave clear manage illusion tempo.")
  },
  "Storm Spirit": {
    "Anti-Mage": matchup(9, 4, 3, "Mana burn and late scaling pressure Storm's resource game."),
    "Puck": matchup(8, 4, 3, "Silence and Coil punish predictable zips."),
    "Doom": matchup(13, 5, 5, "Doom removes Storm from the fight entirely.")
  },
  "Sniper": {
    "Spirit Breaker": matchup(12, 6, 4, "Charge bypasses Sniper's range advantage."),
    "Puck": matchup(11, 5, 4, "Mobility and silence reach Sniper's backline."),
    "Mars": matchup(8, 5, 3, "Arena blocks Sniper's damage angles.")
  }
};

function hero(name, roles, damage, tags, vulnerableTo, answers, patchScore, summary) {
  return { name, roles, damage, tags, vulnerableTo, answers, patchScore, summary };
}

function combo(heroes, score, summary) {
  return { heroes, score, summary };
}

function matchup(advantage, lane, intensity, summary) {
  return { advantage, lane, intensity, summary };
}

function mergeHeroes(curated, generated) {
  const byName = new Map(generated.map((hero) => [hero.name, hero]));
  for (const hero of curated) byName.set(hero.name, { ...byName.get(hero.name), ...hero });
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

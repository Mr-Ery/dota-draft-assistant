import { COUNTERS, COMBOS, HEROES } from "../draft-data.js";
import { counterRuleFor } from "../data/counter-pick-rules.js";

const roleWeights = {
  "Position 1": ["scaling", "roshan", "tower"],
  "Position 2": ["tempo", "rune", "burst", "mobility"],
  "Position 3": ["frontline", "initiation", "anti-carry"],
  "Position 4": ["roam", "disable", "initiation"],
  "Position 5": ["save", "sustain", "warding", "disable"]
};

export function getHero(name) {
  return HEROES.find((hero) => hero.name === name);
}

export function pickedSet(draft) {
  return new Set([...draft.enemies, ...draft.allies]);
}

export function scoreHero(hero, draft) {
  if (!draft.role || !hero.roles.includes(draft.role)) return null;
  if (pickedSet(draft).has(hero.name)) return null;

  const details = [];
  let score = 52 + hero.patchScore * 0.8;

  for (const enemy of draft.enemies) {
    const counter = COUNTERS[enemy]?.[hero.name];
    if (counter) {
      score += counter.advantage * 0.9 + counter.lane * 0.35 + counter.intensity * 1.25;
      details.push(`${counter.summary} vs ${enemy}`);
    } else {
      score += enemyOnlyTagScore(hero, enemy);
    }
    if (counterRuleFor(enemy, hero.name)) {
      score += 5.5;
      details.push(`${hero.name} is a known counter-pick pattern into ${enemy}.`);
    }
  }

  if (draft.philosophy === "full") {
    for (const ally of draft.allies) {
      const combo = comboScore(hero.name, ally);
      if (combo) {
        score += combo.score * 0.45;
        details.push(combo.summary);
      }
      score += allyTagScore(hero, ally);
    }

    const balance = teamBalanceScore(hero, draft.allies);
    score += balance.score;
    details.push(...balance.details);
  }

  score += roleFit(hero, draft.role);
  score -= draft.enemies.length * 0.8;

  return {
    hero,
    score: finalizeScore(score),
    details: details.slice(0, 5),
    analysis: explainHero(hero, draft, details)
  };
}

export function recommendations(draft, limit = 8) {
  return HEROES
    .map((hero) => scoreHero(hero, draft))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function finalAnalysis(heroName, draft) {
  const hero = getHero(heroName);
  if (!hero) return null;
  const scored = scoreHero(hero, draft) || {
    hero,
    score: 0,
    details: [],
    analysis: explainHero(hero, draft, [])
  };
  const context = draftContext(hero, draft);
  const strengths = heroStrengths(hero, draft, scored.details, context);
  const weaknesses = heroWeaknesses(hero, context);

  return {
    ...scored,
    analysis: explainHero(hero, draft, scored.details),
    matchupExplanation: matchupExplanation(hero, draft, scored.details, context),
    strengths: strengths.length ? strengths : [hero.summary],
    weaknesses: weaknesses.length ? weaknesses : ["Respect enemy power spikes before your first major item."],
    timings: timingWindows(hero, draft.role, context),
    threats: threatAnalysis(hero, draft),
    gameplayPlan: gameplayPlan(hero, draft, context)
  };
}

export function draftHealth(draft) {
  const team = draft.philosophy === "full" ? draft.allies.map(getHero).filter(Boolean) : [];
  const enemy = draft.enemies.map(getHero).filter(Boolean);
  const tags = new Set(team.flatMap((hero) => hero.tags));
  const enemyTags = new Set(enemy.flatMap((hero) => hero.tags));
  const strengths = [];
  const weaknesses = [];

  if (draft.philosophy !== "full") {
    return {
      strengths: ["Fast counter-pick mode is using enemy heroes only."],
      weaknesses: enemy.length ? enemyWeaknesses(enemy) : ["Add enemy picks to expose lineup weaknesses."]
    };
  }

  if (tags.has("teamfight")) strengths.push("strong teamfight");
  if (tags.has("initiation")) strengths.push("reliable initiation");
  if (tags.has("tower")) strengths.push("tower pressure");
  if (tags.has("roshan")) strengths.push("Roshan control");
  if (tags.has("mobility")) strengths.push("high mobility");
  if (!tags.has("disable")) weaknesses.push("low disable");
  if (!tags.has("frontline")) weaknesses.push("no clear frontline");
  if (!tags.has("tower")) weaknesses.push("low tower damage");
  if (enemyTags.has("split-push") && !tags.has("catch")) weaknesses.push("limited split-push catch");

  return { strengths, weaknesses };
}

function enemyOnlyTagScore(hero, enemyName) {
  const enemy = getHero(enemyName);
  if (!enemy) return 0;
  let score = 0;
  if (enemy.vulnerableTo.some((tag) => hero.tags.includes(tag))) score += 3.8;
  if (hero.answers.some((tag) => enemy.tags.includes(tag))) score += 3.2;
  if (hero.damage !== enemy.damage) score += 0.6;
  return score;
}

function allyTagScore(hero, allyName) {
  const ally = getHero(allyName);
  if (!ally) return 0;
  let score = 0;
  if (hero.tags.includes("initiation") && ally.tags.includes("teamfight")) score += 2.5;
  if (hero.tags.includes("save") && ally.tags.includes("scaling")) score += 2.1;
  if (hero.tags.includes("disable") && ally.tags.includes("burst")) score += 2;
  if (hero.damage !== ally.damage) score += 0.8;
  return score;
}

function comboScore(a, b) {
  const combo = COMBOS.find((item) => item.heroes.includes(a) && item.heroes.includes(b));
  return combo ? { score: combo.score, summary: combo.summary } : null;
}

function teamBalanceScore(candidate, allies) {
  const team = [...allies.map(getHero), candidate].filter(Boolean);
  const details = [];
  let score = 0;
  const damageTypes = new Set(team.map((hero) => hero.damage));
  const tags = new Set(team.flatMap((hero) => hero.tags));

  if (damageTypes.size > 1) {
    score += 2.2;
    details.push("Improves damage type balance.");
  }
  if (tags.has("disable") && tags.has("initiation")) {
    score += 2.8;
    details.push("Adds catch plus initiation structure.");
  }
  if (tags.has("tower") || tags.has("roshan")) {
    score += 1.8;
    details.push("Adds objective pressure.");
  }
  if (!tagSet(allies).has("frontline") && candidate.tags.includes("frontline")) {
    score += 3;
    details.push("Solves frontline weakness.");
  }
  return { score, details };
}

function roleFit(hero, role) {
  return roleWeights[role].reduce((total, tag) => total + (hero.tags.includes(tag) ? 1.8 : 0), 0);
}

function finalizeScore(rawScore) {
  if (rawScore <= 82) return Math.max(0, Math.round(rawScore));
  return Math.min(94, Math.round(82 + (rawScore - 82) * 0.18));
}

function tagSet(names) {
  return new Set(names.map(getHero).filter(Boolean).flatMap((hero) => hero.tags));
}

function explainHero(hero, draft, details) {
  const enemies = draft.enemies.map(getHero).filter(Boolean);
  const allies = draft.allies.map(getHero).filter(Boolean);
  const enemyNames = enemies.map((enemy) => enemy.name).join(", ") || "the unknown enemy draft";
  const bestDetail = details[0];

  if (draft.philosophy === "enemy") {
    return bestDetail
      ? `${hero.name} is recommended for ${draft.role} because ${bestDetail} The score is based only on enemy picks: ${enemyNames}.`
      : `${hero.name} is recommended for ${draft.role} against ${enemyNames} because its ${hero.tags.slice(0, 3).join(", ")} profile answers the visible enemy draft.`;
  }
  const allyNames = allies.map((ally) => ally.name).join(", ") || "no allied picks yet";
  return bestDetail
    ? `${hero.name} fits ${draft.role} here because ${bestDetail} It is also checked against allied picks: ${allyNames}.`
    : `${hero.name} is evaluated against ${enemyNames} while checking synergy with ${allyNames}, lane shape, damage balance, control, and timing fit.`;
}

function enemyWeaknesses(enemyHeroes) {
  const tags = new Set(enemyHeroes.flatMap((hero) => hero.tags));
  return [
    tags.has("scaling") && !tags.has("tempo") ? "enemy draft may be punishable before late game" : null,
    !tags.has("disable") ? "enemy draft is light on disable" : null,
    !tags.has("frontline") ? "enemy draft lacks a durable frontliner" : null,
    tags.has("split-push") ? "enemy split-push must be answered with catch" : null
  ].filter(Boolean);
}

function timingWindows(hero, role, context = { enemies: [], tags: new Set() }) {
  const windows = [];
  const enemyNames = context.enemies.map((enemy) => enemy.name).join(", ");
  if (role === "Position 2") windows.push(`Secure rune control before ${enemyNames || "the enemy mids"} can rotate first.`);
  if (role === "Position 3") windows.push(`Pressure the enemy safe-lane core and force reactions before their first major item.`);
  if (role === "Position 1") windows.push(`Do not join low-value fights until your first farming/fighting item solves ${primaryEnemyPressure(context)}.`);
  if (role === "Position 4") windows.push(`Move after your first disable/boot timing and attack the weakest enemy side lane.`);
  if (role === "Position 5") windows.push(`Protect lane equilibrium, then smoke when your strongest ally timing lines up.`);
  if (hero.tags.includes("roshan")) windows.push(`Call Roshan after a won fight, especially if ${enemyNames || "the enemy draft"} lacks contest tools.`);
  if (hero.tags.includes("tower")) windows.push("Convert catapult waves into tower pressure instead of only farming kills.");
  if (context.tags.has("split-push")) windows.push("Keep TP or catch available because the enemy draft can split the map.");
  if (context.tags.has("silence")) windows.push("Delay deep commits until dispel/BKB/Linken timing is available.");
  return windows.slice(0, 4);
}

function threatAnalysis(hero, draft) {
  const threats = draft.enemies.map(getHero).filter(Boolean).filter((enemy) => {
    return enemy.tags.some((tag) => hero.vulnerableTo.includes(tag)) || hero.vulnerableTo.some((tag) => enemy.tags.includes(tag));
  });
  return threats.length
    ? threats.map((enemy) => `${enemy.name}: ${enemy.summary}`).slice(0, 4)
    : ["No direct hard counter is currently selected, but respect smoke timings and rune fights."];
}

function draftContext(hero, draft) {
  const enemies = draft.enemies.map(getHero).filter(Boolean);
  const allies = draft.allies.map(getHero).filter(Boolean);
  const tags = new Set(enemies.flatMap((enemy) => enemy.tags));
  const allyTags = new Set(allies.flatMap((ally) => ally.tags));
  return {
    enemies,
    allies,
    tags,
    allyTags,
    hasSilence: tags.has("silence") || enemies.some((enemy) => ["Doom", "Skywrath Mage", "Silencer"].includes(enemy.name)),
    hasCatch: tags.has("catch") || tags.has("disable") || tags.has("initiation"),
    hasIllusions: tags.has("illusion") || enemies.some((enemy) => ["Phantom Lancer", "Naga Siren", "Terrorblade", "Chaos Knight"].includes(enemy.name)),
    hasHighMagic: [...tags].some((tag) => ["burst", "magical", "teamfight", "damage-over-time"].includes(tag)),
    hasPhysical: tags.has("physical") || tags.has("anti-carry") || tags.has("ranged-poke"),
    hasSustain: tags.has("sustain") || tags.has("save"),
    hasSplitPush: tags.has("split-push"),
    hero
  };
}

function matchupExplanation(hero, draft, details, context) {
  const lines = [];
  const enemyNames = context.enemies.map((enemy) => enemy.name).join(", ");
  if (details.length) lines.push(...details);
  if (context.hasIllusions) lines.push(`${hero.name} must account for enemy illusion pressure from ${enemyNames}; itemization should include wave clear, armor, or durable scaling depending on role.`);
  if (context.hasSilence) lines.push(`${enemyNames} creates silence/lockdown risk, so the build should prioritize dispel, BKB, Linken, Lotus, or safer positioning.`);
  if (context.hasHighMagic) lines.push(`The enemy draft has notable magic burst, so early magic resistance or BKB timing matters more than a greedy build.`);
  if (context.hasPhysical) lines.push(`The enemy draft has physical pressure, so armor, Crimson, Butterfly, or disarm options become more valuable.`);
  if (draft.philosophy === "full" && context.allies.length) {
    lines.push(`${hero.name} is also checked with allied picks ${context.allies.map((ally) => ally.name).join(", ")} for damage balance, initiation, and follow-up.`);
  }
  return unique(lines).slice(0, 5);
}

function heroStrengths(hero, draft, details, context) {
  const lines = [...details];
  if (hero.tags.includes("frontline")) lines.push(`${hero.name} can stand in front of allied cores and absorb the first enemy spell cycle.`);
  if (hero.tags.includes("disable")) lines.push(`${hero.name} gives the draft control against ${context.enemies.map((enemy) => enemy.name).join(", ") || "mobile enemy heroes"}.`);
  if (hero.tags.includes("tower")) lines.push(`${hero.name} can convert lane wins into tower damage instead of only farming.`);
  if (hero.tags.includes("roshan")) lines.push(`${hero.name} creates Roshan pressure after the first won fight.`);
  if (hero.tags.includes("split-push") && !context.hasCatch) lines.push(`${hero.name} can stretch the map because the enemy draft currently lacks strong catch.`);
  if (draft.philosophy === "full" && context.allyTags.has("teamfight") && hero.tags.includes("initiation")) {
    lines.push(`${hero.name} starts fights for allied teamfight spells.`);
  }
  return unique(lines).slice(0, 5);
}

function heroWeaknesses(hero, context) {
  const lines = [];
  if (context.hasSilence && hero.vulnerableTo.includes("silence")) lines.push(`${hero.name} is vulnerable to silence, so fighting before dispel/BKB timing is risky.`);
  if (context.hasCatch && hero.vulnerableTo.includes("disable")) lines.push(`${hero.name} can be chain-controlled if caught before defensive items.`);
  if (context.hasHighMagic && hero.vulnerableTo.includes("burst")) lines.push(`Enemy magic burst can punish ${hero.name} before survivability items are finished.`);
  if (context.hasPhysical && !hero.tags.includes("frontline")) lines.push(`${hero.name} needs positioning discipline because the enemy physical damage can punish frontlining.`);
  if (context.hasIllusions && !hero.tags.includes("wave-clear") && !hero.tags.includes("teamfight")) lines.push(`${hero.name} may need item help against illusion waves.`);
  if (hero.vulnerableTo.includes("kite")) lines.push(`${hero.name} needs catch or mobility items before forcing long chases.`);
  return unique(lines);
}

function gameplayPlan(hero, draft, context) {
  const lines = [];
  const enemyNames = context.enemies.map((enemy) => enemy.name).join(", ") || "the enemy draft";
  if (draft.role === "Position 1") lines.push(`Farm toward the first hero-specific timing, then fight only when it answers ${primaryEnemyPressure(context)} from ${enemyNames}.`);
  if (draft.role === "Position 2") lines.push(`Use rune control to pressure the lane that ${enemyNames} cannot easily defend.`);
  if (draft.role === "Position 3") lines.push(`Force the enemy carry to react early; your item build should answer their main damage type, not follow a fixed offlane template.`);
  if (draft.role === "Position 4") lines.push(`Play around smoke and side-lane pressure; choose utility items based on whether ${enemyNames} threatens burst, catch, or sustain.`);
  if (draft.role === "Position 5") lines.push(`Stand behind the core most threatened by ${enemyNames}; your first save item should match their damage type.`);
  if (context.hasSilence) lines.push("Avoid starting fights without a dispel/BKB/Linken/Lotus answer to silence.");
  if (context.hasIllusions) lines.push("Keep lanes pushed and do not waste cooldowns before illusion waves are controlled.");
  if (context.hasSustain) lines.push("Buy or ask for anti-heal if fights become long.");
  if (hero.tags.includes("roshan")) lines.push("Turn the first clean kill near river into Roshan pressure.");
  if (hero.tags.includes("split-push")) lines.push("Show on side lanes only when the enemy catch heroes are visible.");
  return unique(lines).slice(0, 5);
}

function primaryEnemyPressure(context) {
  if (context.hasSilence) return "silence/control";
  if (context.hasIllusions) return "illusion pressure";
  if (context.hasHighMagic) return "magic burst";
  if (context.hasPhysical) return "physical damage";
  if (context.hasSplitPush) return "split-push";
  return "the enemy timing";
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

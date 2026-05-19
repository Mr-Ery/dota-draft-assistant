import { writeFile, mkdir } from "node:fs/promises";

const heroes = [
  "abaddon", "alchemist", "ancient-apparition", "anti-mage", "arc-warden", "axe", "bane", "batrider",
  "beastmaster", "bloodseeker", "bounty-hunter", "brewmaster", "bristleback", "broodmother", "centaur-warrunner",
  "chaos-knight", "chen", "clinkz", "clockwerk", "crystal-maiden", "dark-seer", "dark-willow", "dawnbreaker",
  "dazzle", "death-prophet", "disruptor", "doom", "dragon-knight", "drow-ranger", "earth-spirit", "earthshaker",
  "elder-titan", "ember-spirit", "enchantress", "enigma", "faceless-void", "grimstroke", "gyrocopter", "hoodwink",
  "huskar", "invoker", "io", "jakiro", "juggernaut", "keeper-of-the-light", "kez", "kunkka", "legion-commander",
  "leshrac", "lich", "lifestealer", "lina", "lion", "lone-druid", "luna", "lycan", "magnus", "marci", "mars",
  "medusa", "meepo", "mirana", "monkey-king", "morphling", "muerta", "naga-siren", "natures-prophet",
  "necrophos", "night-stalker", "nyx-assassin", "ogre-magi", "omniknight", "oracle", "outworld-destroyer",
  "pangolier", "phantom-assassin", "phantom-lancer", "phoenix", "primal-beast", "puck", "pudge", "pugna",
  "queen-of-pain", "razor", "riki", "ringmaster", "rubick", "sand-king", "shadow-demon", "shadow-fiend",
  "shadow-shaman", "silencer", "skywrath-mage", "slardar", "slark", "snapfire", "sniper", "spectre",
  "spirit-breaker", "storm-spirit", "sven", "techies", "templar-assassin", "terrorblade", "tidehunter",
  "timbersaw", "tinker", "tiny", "treant-protector", "troll-warlord", "tusk", "underlord", "undying", "ursa",
  "vengeful-spirit", "venomancer", "viper", "visage", "void-spirit", "warlock", "weaver", "windranger",
  "winter-wyvern", "witch-doctor", "wraith-king", "zeus"
];

const userAgent = "Mozilla/5.0 DotaDraftAssistant/1.0";

async function scrapeHero(slug) {
  const response = await fetch(`https://www.dotabuff.com/heroes/${slug}/counters`, {
    headers: { "user-agent": userAgent, accept: "text/html" }
  });
  if (!response.ok) {
    return {
      hero: slug,
      source: `https://www.dotabuff.com/heroes/${slug}/counters`,
      scrapedAt: new Date().toISOString(),
      error: `${response.status} ${response.statusText}`,
      counters: []
    };
  }
  const html = await response.text();
  return {
    hero: slug,
    source: `https://www.dotabuff.com/heroes/${slug}/counters`,
    scrapedAt: new Date().toISOString(),
    counters: parseCounters(html)
  };
}

function parseCounters(html) {
  const rows = [...html.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((match) => match[0]);
  return rows.map((row) => {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((match) => clean(match[1]));
    const heroMatch = row.match(/\/heroes\/([^"/]+)"/);
    if (!heroMatch || cells.length < 3) return null;
    return {
      hero: heroMatch[1],
      matchupAdvantage: parseNumber(cells.at(-3)),
      laneWinRate: parseNumber(cells.at(-2)),
      matchWinRate: parseNumber(cells.at(-1)),
      counterIntensity: Math.abs(parseNumber(cells.at(-3)) || 0)
    };
  }).filter(Boolean);
}

function clean(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function parseNumber(value) {
  const match = String(value).match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

await mkdir("data", { recursive: true });
const records = [];
for (const slug of heroes) {
  try {
    records.push(await scrapeHero(slug));
  } catch (error) {
    records.push({
      hero: slug,
      source: `https://www.dotabuff.com/heroes/${slug}/counters`,
      scrapedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      counters: []
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 1250));
}
await writeFile("data/dotabuff-counters-7.41c.json", JSON.stringify(records, null, 2));
console.log(`Saved ${records.length} hero counter pages.`);

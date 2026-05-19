import { mkdir, writeFile } from "node:fs/promises";

const dotabuffBase = "https://www.dotabuff.com/heroes";
const openDotaBase = "https://api.opendota.com/api";
const userAgent = "Mozilla/5.0 DotaDraftAssistant/1.0";

async function main() {
  await mkdir("data", { recursive: true });
  const heroStats = await fetchJson(`${openDotaBase}/heroStats`);
  const heroes = heroStats.map((hero) => ({
    id: hero.id,
    name: hero.localized_name,
    internalName: hero.name,
    slug: toDotabuffSlug(hero.localized_name),
    roles: hero.roles || [],
    primaryAttr: hero.primary_attr,
    attackType: hero.attack_type,
    image: hero.img,
    icon: hero.icon
  }));

  const records = [];
  for (const hero of heroes) {
    records.push(await buildHeroRecord(hero));
    await sleep(900);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    patch: "7.41c",
    heroCount: records.length,
    sources: {
      openDotaHeroStats: `${openDotaBase}/heroStats`,
      openDotaItemPopularity: `${openDotaBase}/heroes/{hero_id}/itemPopularity`,
      openDotaMatchups: `${openDotaBase}/heroes/{hero_id}/matchups`,
      dotabuffOverview: `${dotabuffBase}/{hero_slug}`,
      dotabuffItems: `${dotabuffBase}/{hero_slug}/items`,
      dotabuffCounters: `${dotabuffBase}/{hero_slug}/counters`
    },
    heroes: records
  };

  await writeFile("data/hero-database-7.41c.json", JSON.stringify(payload, null, 2));
  console.log(`Saved ${records.length} hero records to data/hero-database-7.41c.json`);
}

async function buildHeroRecord(hero) {
  const [itemPopularity, matchups, dotabuffOverview, dotabuffItems, dotabuffCounters] = await Promise.all([
    safeJson(`${openDotaBase}/heroes/${hero.id}/itemPopularity`),
    safeJson(`${openDotaBase}/heroes/${hero.id}/matchups`),
    safeHtml(`${dotabuffBase}/${hero.slug}`),
    safeHtml(`${dotabuffBase}/${hero.slug}/items`),
    safeHtml(`${dotabuffBase}/${hero.slug}/counters`)
  ]);

  return {
    ...hero,
    dotabuff: {
      overviewUrl: `${dotabuffBase}/${hero.slug}`,
      itemsUrl: `${dotabuffBase}/${hero.slug}/items`,
      countersUrl: `${dotabuffBase}/${hero.slug}/counters`,
      overview: parseDotabuffOverview(dotabuffOverview.html),
      popularItems: parseDotabuffItems(dotabuffOverview.html || dotabuffItems.html),
      counters: parseDotabuffCounters(dotabuffCounters.html)
    },
    openDota: {
      itemPopularity: itemPopularity.data || null,
      matchups: matchups.data || null,
      errors: [itemPopularity.error, matchups.error].filter(Boolean)
    },
    errors: [dotabuffOverview.error, dotabuffItems.error, dotabuffCounters.error].filter(Boolean)
  };
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": userAgent, accept: "application/json" } });
  if (!response.ok) throw new Error(`${url}: ${response.status} ${response.statusText}`);
  return response.json();
}

async function safeJson(url) {
  try {
    return { data: await fetchJson(url), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : String(error) };
  }
}

async function safeHtml(url) {
  try {
    const response = await fetch(url, { headers: { "user-agent": userAgent, accept: "text/html" } });
    if (!response.ok) return { html: null, error: `${url}: ${response.status} ${response.statusText}` };
    return { html: await response.text(), error: null };
  } catch (error) {
    return { html: null, error: error instanceof Error ? error.message : String(error) };
  }
}

function parseDotabuffOverview(html) {
  if (!html) return null;
  return {
    popularityRank: findText(html, /Popularity\s*<\/[^>]+>\s*<[^>]+>\s*([^<]+)/i),
    winRate: findText(html, /Win Rate\s*<\/[^>]+>\s*<[^>]+>\s*([^<]+)/i),
    lanePresence: parseLanePresence(html),
    lastUpdated: findText(html, /Last Updated\s+([0-9-]+)/i)
  };
}

function parseDotabuffItems(html) {
  if (!html) return [];
  const section = sliceBetween(html, "Most Used Items This Week", "Best Versus This Week") || html;
  const rows = [...section.matchAll(/Image: ([^"<]+)[\s\S]*?\/items\/([^"]+)"[\s\S]*?([0-9,.]+)%/g)];
  return rows.map((match) => ({
    name: clean(match[1]),
    slug: match[2],
    winRate: Number(match[3].replace(",", ""))
  })).slice(0, 20);
}

function parseDotabuffCounters(html) {
  if (!html) return { bestVersus: [], worstVersus: [] };
  const best = sliceBetween(html, "Best Versus This Week", "Worst Versus This Week");
  const worst = sliceBetween(html, "Worst Versus This Week", "Last Updated");
  return {
    bestVersus: parseCounterRows(best),
    worstVersus: parseCounterRows(worst)
  };
}

function parseCounterRows(html) {
  if (!html) return [];
  return [...html.matchAll(/Image: ([^"<]+)[\s\S]*?\/heroes\/([^"]+)"[\s\S]*?(-?[0-9.]+)%[\s\S]*?([0-9.]+)%[\s\S]*?([0-9,]+)/g)]
    .map((match) => ({
      hero: clean(match[1]),
      slug: match[2],
      advantage: Number(match[3]),
      winRate: Number(match[4]),
      matches: Number(match[5].replaceAll(",", ""))
    }))
    .slice(0, 20);
}

function parseLanePresence(html) {
  const lanes = {};
  for (const lane of ["Safe Lane", "Mid Lane", "Off Lane", "Roaming", "Jungle"]) {
    const escaped = lane.replace(" ", "\\s+");
    const match = html.match(new RegExp(`${escaped}\\s+([0-9.]+)%\\s+([0-9.]+)%`, "i"));
    if (match) lanes[lane] = { presence: Number(match[1]), winRate: Number(match[2]) };
  }
  return lanes;
}

function findText(html, pattern) {
  const match = html.match(pattern);
  return match ? clean(match[1]) : null;
}

function sliceBetween(value, start, end) {
  if (!value) return null;
  const startIndex = value.indexOf(start);
  if (startIndex === -1) return null;
  const endIndex = value.indexOf(end, startIndex + start.length);
  return value.slice(startIndex, endIndex === -1 ? undefined : endIndex);
}

function clean(value) {
  return String(value).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function toDotabuffSlug(name) {
  return name.toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

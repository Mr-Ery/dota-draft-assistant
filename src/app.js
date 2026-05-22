import { HEROES, laneTypes, roles, philosophies } from "./draft-data.js";
import { draftHealth, finalAnalysis, recommendations } from "./engine/recommendation-engine.js";
import {
  abilityIconCandidates,
  dotabuffHeroUrl,
  dota2ProTrackerHeroUrl,
  fallbackAttribute,
  heroAbilities,
  heroPortraitCandidates,
  heroProfileCandidates,
  itemIconCandidates
} from "./services/assets.js";
import { criticalItemsForGame, itemBuild } from "./services/builds.js";

const state = {
  step: 1,
  philosophy: null,
  role: null,
  allies: [],
  enemies: [],
  query: "",
  side: "enemy",
  finalHero: null
};

const roleMap = {
  "Position 1": "Carry",
  "Position 2": "Mid",
  "Position 3": "Offlane",
  "Position 4": "Soft Support",
  "Position 5": "Hard Support"
};

const app = document.querySelector("#app");

document.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const fallbacks = image.dataset.fallbacks?.split("|").filter(Boolean) || [];
  if (!fallbacks.length) return;
  image.dataset.fallbacks = fallbacks.slice(1).join("|");
  image.src = fallbacks[0];
}, true);

function render() {
  if (state.step === 1) return renderPhilosophy();
  if (state.step === 2) return renderRole();
  if (state.step === 4) return renderFinal();
  return renderDraft();
}

function renderPhilosophy() {
  app.innerHTML = `
    <section class="start-shell">
      <div class="start-copy">
        <p class="eyebrow">Patch 7.41c draft setup</p>
        <h1>Select analysis philosophy</h1>
        <p>The assistant locks its draft inputs and scoring model based on this choice.</p>
      </div>
      <div class="choice-grid">
        ${philosophies.map((item) => `
          <button class="choice-card" data-philosophy="${item.id}">
            <span>${item.label}</span>
            <small>${item.description}</small>
          </button>
        `).join("")}
      </div>
    </section>
  `;
  app.querySelectorAll("[data-philosophy]").forEach((button) => {
    button.addEventListener("click", () => {
      state.philosophy = button.dataset.philosophy;
      state.side = "enemy";
      state.allies = [];
      state.step = 2;
      render();
    });
  });
}

function renderRole() {
  const philosophy = philosophies.find((item) => item.id === state.philosophy);
  app.innerHTML = `
    <section class="start-shell">
      <div class="start-copy">
        <p class="eyebrow">${philosophy.label}</p>
        <h1>Select your role</h1>
        <p>Each role uses different priorities for lane responsibility, farm access, roaming, saves, initiation, and scaling.</p>
      </div>
      <div class="role-grid">
        ${roles.map((role) => `
          <button class="role-button" data-role="${role.id}">
            <strong>${role.id}</strong>
            <span>${role.title}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
  app.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.role = button.dataset.role;
      state.step = 3;
      render();
    });
  });
}

function renderDraft() {
  const recs = recommendations(state);
  const picked = new Set([...state.enemies, ...state.allies]);
  const activeLimit = state.side === "enemy" ? 5 : 4;
  const activeCount = state.side === "enemy" ? state.enemies.length : state.allies.length;
  const canAdd = activeCount < activeLimit;
  const availableHeroes = HEROES
    .filter((hero) => !picked.has(hero.name))
    .filter((hero) => hero.name.toLowerCase().includes(state.query.toLowerCase()))
    .slice(0, 16);
  const health = draftHealth(state);
  const fullMode = state.philosophy === "full";

  app.innerHTML = `
    <section class="draft-shell">
      <header class="topbar app-header">
        <div>
          <p class="eyebrow">${fullMode ? "Full team analysis" : "Enemy picks only"}</p>
          <h1>${roleMap[state.role]} live draft</h1>
        </div>
        <button class="ghost" id="reset">Setup</button>
      </header>

      <section class="draft-layout ${fullMode ? "" : "enemy-only-layout"}">
        <aside class="pick-panel">
          ${fullMode ? renderSideToggle() : `<div class="locked-mode">Enemy input only</div>`}
          <div class="limit-line">${state.side === "enemy" ? "Enemy team" : "Allied team"}: ${activeCount}/${activeLimit}</div>
          <input id="hero-search" placeholder="${canAdd ? "Type hero name" : "Team limit reached"}" value="${state.query}" autocomplete="off" ${canAdd ? "" : "disabled"} />
          <div class="hero-results">
            ${canAdd ? availableHeroes.map((hero) => renderHeroResult(hero)).join("") : `<div class="empty-state">Remove a pick to add another hero.</div>`}
          </div>
        </aside>

        <section class="board ${fullMode ? "" : "single-board"}">
          ${renderPickColumn("Enemies", state.enemies, "enemy", 5)}
          ${fullMode ? renderPickColumn("Allies", state.allies, "ally", 4) : ""}
        </section>

        <section class="recommendations" aria-live="polite">
          <div class="rec-header">
            <div>
              <p class="eyebrow">User hero pool</p>
              <h2>Best ${roleMap[state.role]} picks now</h2>
            </div>
            <span>${recs.length} live</span>
          </div>
          <div class="rec-list">
            ${recs.map((rec, index) => renderRecommendation(rec, index)).join("")}
          </div>
        </section>
      </section>

      <section class="intelligence">
        <article>
          <h2>Draft strengths</h2>
          <p>${health.strengths.length ? health.strengths.join(", ") : "Waiting for more draft data."}</p>
        </article>
        <article>
          <h2>Draft risks</h2>
          <p>${health.weaknesses.length ? health.weaknesses.join(", ") : "No major structural risk detected yet."}</p>
        </article>
        <article>
          <h2>Lane lens</h2>
          <p>${laneTypes.join(", ")}</p>
        </article>
      </section>
    </section>
  `;

  app.querySelector("#reset").addEventListener("click", resetSetup);
  app.querySelectorAll("[data-side]").forEach((button) => {
    button.addEventListener("click", () => {
      state.side = button.dataset.side;
      state.query = "";
      renderDraft();
    });
  });
  const search = app.querySelector("#hero-search");
  if (search) {
    search.addEventListener("input", (event) => {
      state.query = event.target.value;
      renderDraft();
      const input = app.querySelector("#hero-search");
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  }
  app.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => addPick(button.dataset.add, state.side)));
  app.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => removePick(button.dataset.remove)));
  app.querySelectorAll("[data-final]").forEach((button) => button.addEventListener("click", () => openFinal(button.dataset.final)));
}

function renderSideToggle() {
  return `
    <div class="mode-toggle" role="tablist" aria-label="Pick side">
      <button class="${state.side === "enemy" ? "active" : ""}" data-side="enemy">Enemy</button>
      <button class="${state.side === "ally" ? "active" : ""}" data-side="ally">Ally</button>
    </div>
  `;
}

function renderHeroResult(hero) {
  return `
    <button class="hero-row" data-add="${hero.name}">
      ${assetImg(heroPortraitCandidates(hero.name), hero.name)}
      <span>${hero.name}</span>
      <small>${hero.roles.map((role) => role.replace("Position ", "P")).join(" / ")}</small>
    </button>
  `;
}

function renderRecommendation(rec, index) {
  return `
    <button class="rec-card" data-final="${rec.hero.name}">
      <div class="rank">${index + 1}</div>
      ${assetImg(heroPortraitCandidates(rec.hero.name), rec.hero.name, "rec-portrait")}
      <div>
        <div class="rec-title">
          <h3>${rec.hero.name}</h3>
          ${renderStars(rec.stars)}
        </div>
        <p>${rec.details[0] || rec.hero.summary}</p>
        ${renderEnemyBreakdown(rec.enemyBreakdown)}
        <div class="tagline">${rec.hero.tags.slice(0, 5).join(" | ")}</div>
      </div>
    </button>
  `;
}

function renderStars(stars) {
  return `<div class="stars" aria-label="${stars} of 5 stars">${Array.from({ length: 5 }).map((_, index) => `<span class="${index < stars ? "filled" : ""}">&#9733;</span>`).join("")}</div>`;
}

function renderEnemyBreakdown(rows = []) {
  if (!rows.length) return "";
  return `
    <div class="enemy-breakdown">
      ${rows.map((row) => `<span>vs ${row.enemy}: <strong>${row.score}/100</strong></span>`).join("")}
    </div>
  `;
}

function renderPickColumn(title, picks, side, limit) {
  return `
    <div class="pick-column ${side}">
      <h2>${title} <span>${picks.length}/${limit}</span></h2>
      <div class="pick-slots">
        ${Array.from({ length: limit }).map((_, index) => {
          const pick = picks[index];
          return pick
            ? `<button class="pick filled" data-remove="${pick}">${assetImg(heroPortraitCandidates(pick), pick)}<span>${pick}</span><small>remove</small></button>`
            : `<div class="pick empty">Open slot</div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderFinal() {
  const report = finalAnalysis(state.finalHero, state);
  if (!report) {
    state.step = 3;
    return renderDraft();
  }
  const build = itemBuild(report.hero, state.role, state);
  const criticalItems = criticalItemsForGame(report.hero, state.role, state);
  const abilities = heroAbilities(report.hero.name);
  const profile = heroProfileCandidates(report.hero.name);

  app.innerHTML = `
    <section class="final-shell">
      <header class="final-hero">
        <button class="ghost" id="back-to-draft">Back to draft</button>
        ${assetImg(profile, report.hero.name, "final-art")}
        <div class="final-copy">
          <p class="eyebrow">${roleMap[state.role]} final analysis</p>
          <h1>${report.hero.name}</h1>
          <p>${report.analysis}</p>
          ${abilities.length ? `<div class="spell-strip">${abilities.map((ability) => assetImg(abilityIconCandidates(ability), ability.replaceAll("_", " "))).join("")}</div>` : ""}
        </div>
      </header>

      <section class="build-section">
        <div class="section-title">
          <p class="eyebrow">Hero-specific matchup build</p>
          <h2>Dynamic Item Build</h2>
          <div class="source-links">
            <a class="source-link" href="${dota2ProTrackerHeroUrl(report.hero.name)}" target="_blank" rel="noreferrer">Dota2ProTracker ${report.hero.name}</a>
            <a class="source-link" href="${dotabuffHeroUrl(report.hero.name)}" target="_blank" rel="noreferrer">Dotabuff ${report.hero.name}</a>
          </div>
        </div>
        <div class="build-grid">
          ${build.map((phase) => `
            <article class="build-phase">
              <h3>${titlePhase(phase.phase)} <span>${phase.timing}</span></h3>
              <p class="phase-reason">${phase.reason}</p>
              <div class="item-list">
                ${phase.items.map((item) => `
                  <div class="item-row">
                    ${assetImg(itemIconCandidates(item.slug), item.name)}
                    <div>
                      <strong>${item.name}</strong>
                      <p>${item.note}</p>
                    </div>
                  </div>
                `).join("")}
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="critical-section">
        <div class="section-title">
          <p class="eyebrow">Required in this game</p>
          <h2>Enemy-Driven Items</h2>
        </div>
        <div class="critical-grid">
          ${criticalItems.map((item) => `
            <article class="critical-item">
              ${assetImg(itemIconCandidates(item.slug), item.name)}
              <div>
                <h3>${item.name}</h3>
                <p>${item.reason}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    </section>
  `;

  app.querySelector("#back-to-draft").addEventListener("click", () => {
    state.step = 3;
    state.finalHero = null;
    renderDraft();
  });
}

function addPick(name, side) {
  if (!name) return;
  if (state.enemies.includes(name) || state.allies.includes(name)) return;
  if (side === "ally" && state.philosophy !== "full") return;
  if (side === "enemy" && state.enemies.length >= 5) return;
  if (side === "ally" && state.allies.length >= 4) return;
  state[side === "ally" ? "allies" : "enemies"].push(name);
  state.query = "";
  renderDraft();
}

function removePick(name) {
  state.allies = state.allies.filter((item) => item !== name);
  state.enemies = state.enemies.filter((item) => item !== name);
  renderDraft();
}

function openFinal(name) {
  state.finalHero = name;
  state.step = 4;
  renderFinal();
}

function resetSetup() {
  state.step = 1;
  state.philosophy = null;
  state.role = null;
  state.allies = [];
  state.enemies = [];
  state.query = "";
  state.side = "enemy";
  state.finalHero = null;
  render();
}

function gameplayAdvice(hero, draft = state) {
  const advice = [];
  const enemyText = draft.enemies.length ? draft.enemies.join(", ") : "the current enemy draft";
  if (hero.tags.includes("scaling")) advice.push(`Avoid low-value early fights until your first major survival or damage timing against ${enemyText}.`);
  if (hero.tags.includes("tempo")) advice.push(`Use your first rune or level 6 window to pressure the weakest lane against ${enemyText}.`);
  if (hero.tags.includes("split-push")) advice.push(`Keep lanes shoved only when enemy catch heroes from ${enemyText} are visible.`);
  if (hero.tags.includes("initiation")) advice.push(`Smoke around blink or ultimate cooldowns instead of showing first into ${enemyText}.`);
  if (hero.tags.includes("save")) advice.push(`Hold position behind the core most threatened by ${enemyText}.`);
  if (hero.tags.includes("roshan")) advice.push(`Call Roshan after a won fight if ${enemyText} cannot contest cooldowns.`);
  return advice.length ? advice.slice(0, 4) : ["Play around your strongest item timing and avoid fighting into enemy ultimates."];
}

function titlePhase(phase) {
  return phase.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function assetImg(urls, alt, className = "") {
  return `<img ${className ? `class="${className}"` : ""} src="${urls[0]}" data-fallbacks="${fallbackAttribute(urls)}" alt="${alt}" loading="lazy" />`;
}

render();

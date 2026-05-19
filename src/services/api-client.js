import { finalAnalysis, recommendations } from "../engine/recommendation-engine.js";
import { itemBuild } from "./builds.js";

export async function getLiveRecommendations(draft) {
  return recommendations(draft);
}

export async function getFinalHeroReport(heroName, draft) {
  const report = finalAnalysis(heroName, draft);
  return report ? { ...report, build: itemBuild(report.hero, draft.role) } : null;
}

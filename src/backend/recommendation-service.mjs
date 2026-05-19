import { finalAnalysis, recommendations } from "../engine/recommendation-engine.js";
import { itemBuild } from "../services/builds.js";

export function createRecommendationService(database) {
  return {
    live(draft) {
      return recommendations(draft);
    },
    final(heroName, draft) {
      const report = finalAnalysis(heroName, draft);
      return report ? { ...report, build: itemBuild(report.hero, draft.role, draft), database } : null;
    }
  };
}

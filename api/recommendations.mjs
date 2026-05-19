import { createRecommendationService } from "../src/backend/recommendation-service.mjs";

const service = createRecommendationService({ provider: "serverless-7.41c" });

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "POST required" });
    return;
  }

  const { draft, hero } = request.body || {};
  if (hero) {
    response.status(200).json({ report: service.final(hero, draft) });
    return;
  }
  response.status(200).json({ recommendations: service.live(draft) });
}

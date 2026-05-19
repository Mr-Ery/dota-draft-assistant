import { createServer } from "node:http";
import { createRecommendationService } from "../src/backend/recommendation-service.mjs";

const service = createRecommendationService({ provider: "local-seed-7.41c" });
const port = Number(process.env.PORT || 8787);

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  response.setHeader("access-control-allow-origin", "*");
  response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  response.setHeader("access-control-allow-headers", "content-type");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method !== "POST" || !["/api/recommendations", "/api/final"].includes(url.pathname)) {
    json(response, 404, { error: "Not found" });
    return;
  }

  try {
    const body = await readJson(request);
    if (url.pathname === "/api/recommendations") {
      json(response, 200, { recommendations: service.live(body.draft) });
      return;
    }
    json(response, 200, { report: service.final(body.hero, body.draft) });
  } catch (error) {
    json(response, 400, { error: error instanceof Error ? error.message : String(error) });
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Recommendation API listening on ${port}`);
});

function json(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

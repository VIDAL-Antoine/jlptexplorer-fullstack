import type { FastifyInstance } from "fastify";
import { listGrammarPointsSchema } from "../../schemas/grammar-points.schema.js";
import {
  listGrammarPoints,
  getGrammarPoint,
  getGrammarPointScenes,
  createGrammarPoint,
  updateGrammarPoint,
  deleteGrammarPoint,
} from "../../controllers/grammar-points.controller.js";

export async function grammarPointsRoutes(server: FastifyInstance) {
  server.get("/", { schema: listGrammarPointsSchema }, listGrammarPoints);
  server.get("/:slug", getGrammarPoint);
  server.get("/:slug/scenes", getGrammarPointScenes);
  server.post("/", createGrammarPoint);
  server.put("/:slug", updateGrammarPoint);
  server.delete("/:slug", deleteGrammarPoint);
}

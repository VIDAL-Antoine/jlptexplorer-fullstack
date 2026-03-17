import type { FastifyInstance } from "fastify";
import {
  listGrammarPointsQuery,
  grammarPointBody,
  grammarPointParams,
  grammarPointScenesQuery,
} from "@/schemas/grammar-points.schema";
import { localeParams } from "@/schemas/common.schema";
import {
  listGrammarPoints,
  getGrammarPoint,
  getGrammarPointScenes,
  createGrammarPoint,
  updateGrammarPoint,
  deleteGrammarPoint,
} from "@/controllers/grammar-points.controller";

export async function grammarPointsRoutes(server: FastifyInstance) {
  server.get("/", { schema: { params: localeParams, querystring: listGrammarPointsQuery } }, listGrammarPoints);
  server.get("/:slug", { schema: { params: grammarPointParams } }, getGrammarPoint);
  server.get("/:slug/scenes", { schema: { params: grammarPointParams, querystring: grammarPointScenesQuery } }, getGrammarPointScenes);
  server.post("/", { schema: { params: localeParams, body: grammarPointBody } }, createGrammarPoint);
  server.put("/:slug", { schema: { params: grammarPointParams, body: grammarPointBody } }, updateGrammarPoint);
  server.delete("/:slug", { schema: { params: grammarPointParams } }, deleteGrammarPoint);
}

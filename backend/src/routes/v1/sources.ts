import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { listSourcesQuery, sourceBody, sourceSceneQuery } from "@/schemas/sources.schema";
import { localeParams, slugParams } from "@/schemas/common.schema";
import {
  listSources,
  getSource,
  getSourceScenes,
  createSource,
  updateSource,
  deleteSource,
} from "@/controllers/sources.controller";

const localeSlugParams = localeParams.extend({ slug: z.string() });

export async function sourcesPublicRoutes(server: FastifyInstance) {
  server.get("/", { schema: { params: localeParams, querystring: listSourcesQuery } }, listSources);
  server.get("/:slug", { schema: { params: localeSlugParams } }, getSource);
  server.get("/:slug/scenes", { schema: { params: localeSlugParams, querystring: sourceSceneQuery } }, getSourceScenes);
}

export async function sourcesAdminRoutes(server: FastifyInstance) {
  server.post("/", { schema: { body: sourceBody } }, createSource);
  server.put("/:slug", { schema: { params: slugParams, body: sourceBody } }, updateSource);
  server.delete("/:slug", { schema: { params: slugParams } }, deleteSource);
}

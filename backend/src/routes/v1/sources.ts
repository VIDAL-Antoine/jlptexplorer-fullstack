import type { FastifyInstance } from "fastify";
import { listSourcesSchema } from "@/schemas/sources.schema";
import {
  listSources,
  getSource,
  getSourceScenes,
  createSource,
  updateSource,
  deleteSource,
} from "@/controllers/sources.controller";

export async function sourcesPublicRoutes(server: FastifyInstance) {
  server.get("/", { schema: listSourcesSchema }, listSources);
  server.get("/:slug", getSource);
  server.get("/:slug/scenes", getSourceScenes);
}

export async function sourcesAdminRoutes(server: FastifyInstance) {
  server.post("/", createSource);
  server.put("/:slug", updateSource);
  server.delete("/:slug", deleteSource);
}

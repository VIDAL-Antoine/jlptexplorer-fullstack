import type { FastifyInstance } from "fastify";
import {
  sceneBody,
  sceneParams,
  adminSceneParams,
  updateTranslationsBody,
  updateTranslationsParams,
  listScenesQuery,
} from "@/schemas/scenes.schema";
import { localeParams } from "@/schemas/common.schema";
import {
  listScenes,
  getScene,
  createScene,
  updateScene,
  deleteScene,
  updateTranslations,
} from "@/controllers/scenes.controller";

const TAGS = ["scenes"];

export async function scenesPublicRoutes(server: FastifyInstance) {
  server.get("/", { schema: { tags: TAGS, params: localeParams, querystring: listScenesQuery } }, listScenes);
  server.get("/:id", { schema: { tags: TAGS, params: sceneParams } }, getScene);
  server.patch("/:id/translations", { schema: { tags: TAGS, params: updateTranslationsParams, body: updateTranslationsBody } }, updateTranslations);
}

export async function scenesAdminRoutes(server: FastifyInstance) {
  server.post("/", { schema: { tags: TAGS, body: sceneBody } }, createScene);
  server.put("/:id", { schema: { tags: TAGS, params: adminSceneParams, body: sceneBody } }, updateScene);
  server.delete("/:id", { schema: { tags: TAGS, params: adminSceneParams } }, deleteScene);
}

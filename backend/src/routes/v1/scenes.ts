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

export async function scenesPublicRoutes(server: FastifyInstance) {
  server.get("/", { schema: { params: localeParams, querystring: listScenesQuery } }, listScenes);
  server.get("/:id", { schema: { params: sceneParams } }, getScene);
  server.patch("/:id/translations", { schema: { params: updateTranslationsParams, body: updateTranslationsBody } }, updateTranslations);
}

export async function scenesAdminRoutes(server: FastifyInstance) {
  server.post("/", { schema: { body: sceneBody } }, createScene);
  server.put("/:id", { schema: { params: adminSceneParams, body: sceneBody } }, updateScene);
  server.delete("/:id", { schema: { params: adminSceneParams } }, deleteScene);
}

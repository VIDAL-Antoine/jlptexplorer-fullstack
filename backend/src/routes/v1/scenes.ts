import type { FastifyInstance } from "fastify";
import {
  listScenes,
  getScene,
  createScene,
  updateScene,
  deleteScene,
  updateTranslations,
} from "@/controllers/scenes.controller";

export async function scenesPublicRoutes(server: FastifyInstance) {
  server.get("/", listScenes);
  server.get("/:id", getScene);
  server.patch("/:id/translations", updateTranslations);
}

export async function scenesAdminRoutes(server: FastifyInstance) {
  server.post("/", createScene);
  server.put("/:id", updateScene);
  server.delete("/:id", deleteScene);
}

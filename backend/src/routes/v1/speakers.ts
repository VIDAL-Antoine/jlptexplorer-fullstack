import type { FastifyInstance } from "fastify";
import {
  listSpeakers,
  getSpeaker,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "../../controllers/speakers.controller.js";

export async function speakersPublicRoutes(server: FastifyInstance) {
  server.get("/", listSpeakers);
  server.get("/:slug", getSpeaker);
}

export async function speakersAdminRoutes(server: FastifyInstance) {
  server.post("/", createSpeaker);
  server.put("/:slug", updateSpeaker);
  server.delete("/:slug", deleteSpeaker);
}

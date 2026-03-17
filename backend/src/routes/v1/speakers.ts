import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { speakerBody } from "@/schemas/speakers.schema";
import { localeParams, slugParams } from "@/schemas/common.schema";
import {
  listSpeakers,
  getSpeaker,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from "@/controllers/speakers.controller";

const localeSlugParams = localeParams.extend({ slug: z.string() });

export async function speakersPublicRoutes(server: FastifyInstance) {
  server.get("/", { schema: { params: localeParams } }, listSpeakers);
  server.get("/:slug", { schema: { params: localeSlugParams } }, getSpeaker);
}

export async function speakersAdminRoutes(server: FastifyInstance) {
  server.post("/", { schema: { body: speakerBody } }, createSpeaker);
  server.put("/:slug", { schema: { params: slugParams, body: speakerBody } }, updateSpeaker);
  server.delete("/:slug", { schema: { params: slugParams } }, deleteSpeaker);
}

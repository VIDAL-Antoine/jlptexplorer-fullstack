import type { FastifyRequest, FastifyReply } from "fastify";
import * as scenesService from "@/services/scenes.service";
import type { LocaleParams, TranscriptLineInput } from "@/types/common";
import type { jlpt_level } from "@/generated/prisma/enums";

export async function listScenes(
  request: FastifyRequest<{ Params: LocaleParams; Querystring: { source_id?: string; jlpt_level?: jlpt_level } }>,
  _reply: FastifyReply
) {
  const { locale } = request.params;
  const { source_id, jlpt_level } = request.query;
  return scenesService.listScenes(locale, {
    source_id: source_id ? parseInt(source_id, 10) : undefined,
    jlpt_level,
  });
}

export async function getScene(
  request: FastifyRequest<{ Params: LocaleParams & { id: string } }>,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {return reply.status(400).send({ error: "Invalid scene id" });}

  const result = await scenesService.getScene(id, request.params.locale);
  if (!result) {return reply.status(404).send({ error: "Scene not found" });}
  return result;
}

export async function createScene(
  request: FastifyRequest<{
    Body: {
      source_slug: string;
      youtube_video_id: string;
      start_time: number | string;
      end_time: number | string;
      episode_number?: number;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>,
  reply: FastifyReply
) {
  const scene = await scenesService.createScene(request.body);
  return reply.status(201).send(scene);
}

export async function updateScene(
  request: FastifyRequest<{
    Params: { id: string };
    Body: {
      source_slug: string;
      youtube_video_id: string;
      start_time: number | string;
      end_time: number | string;
      episode_number?: number;
      notes?: string;
      transcript_lines: TranscriptLineInput[];
    };
  }>,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {return reply.status(400).send({ error: "Invalid scene id" });}

  return scenesService.updateScene(id, request.body);
}

export async function deleteScene(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {return reply.status(400).send({ error: "Invalid scene id" });}

  await scenesService.deleteScene(id);
  return reply.status(204).send();
}

export async function updateTranslations(
  request: FastifyRequest<{
    Params: LocaleParams & { id: string };
    Body: { transcript_lines: { id: number; translation: string }[] };
  }>,
  reply: FastifyReply
) {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {return reply.status(400).send({ error: "Invalid scene id" });}

  const result = await scenesService.updateTranslations(
    id,
    request.params.locale,
    request.body.transcript_lines
  );
  if (!result) {return reply.status(404).send({ error: "Scene not found or has no transcript lines" });}
  return result;
}

import type { FastifyRequest, FastifyReply } from "fastify";
import * as sourcesService from "@/services/sources.service";
import type { LocaleParams } from "@/schemas/common.schema";
import type { SourceBody, ListSourcesQuery, SourceSceneQuery } from "@/schemas/sources.schema";

export async function listSources(
  request: FastifyRequest<{ Params: LocaleParams; Querystring: ListSourcesQuery }>,
  _reply: FastifyReply
) {
  return sourcesService.listSources(request.params.locale, request.query.type);
}

export async function getSource(
  request: FastifyRequest<{ Params: LocaleParams & { slug: string } }>,
  reply: FastifyReply
) {
  const result = await sourcesService.getSource(request.params.slug, request.params.locale);
  if (!result) {return reply.status(404).send({ error: "Source not found" });}
  return result;
}

export async function getSourceScenes(
  request: FastifyRequest<{ Params: LocaleParams & { slug: string }; Querystring: SourceSceneQuery }>,
  reply: FastifyReply
) {
  const { locale, slug } = request.params;
  const page = Math.max(1, parseInt(request.query.page ?? "1", 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(request.query.limit ?? "12", 10) || 12));
  const grammarPointSlugs =
    request.query.grammar_points?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  const result = await sourcesService.getSourceScenes(slug, locale, { grammarPointSlugs, page, limit });
  if (!result) {return reply.status(404).send({ error: "Source not found" });}
  return result;
}

export async function createSource(
  request: FastifyRequest<{ Body: SourceBody }>,
  reply: FastifyReply
) {
  const source = await sourcesService.createSource(request.body);
  return reply.status(201).send(source);
}

export async function updateSource(
  request: FastifyRequest<{ Params: { slug: string }; Body: SourceBody }>,
  reply: FastifyReply
) {
  const result = await sourcesService.updateSource(request.params.slug, request.body);
  if (!result) {return reply.status(404).send({ error: "Source not found" });}
  return result;
}

export async function deleteSource(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  await sourcesService.deleteSource(request.params.slug);
  return reply.status(204).send();
}

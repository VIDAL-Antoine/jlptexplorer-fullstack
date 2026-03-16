import { flattenSpeaker, flattenSource, flattenGrammarPoint } from "../utils/flatten.js";
import * as speakersRepository from "../repositories/speakers.repository.js";

export async function listSpeakers(locale: string) {
  const speakers = await speakersRepository.findSpeakers(locale);
  return speakers.map(flattenSpeaker);
}

export async function getSpeaker(slug: string, locale: string) {
  const speaker = await speakersRepository.findSpeakerBySlug(slug, locale);
  if (!speaker) return null;

  return {
    ...flattenSpeaker(speaker),
    transcript_lines: speaker.transcript_lines.map((line) => ({
      ...line,
      scenes: {
        ...line.scenes,
        sources: flattenSource(line.scenes.sources),
      },
      transcript_line_grammar_points: line.transcript_line_grammar_points.map((tlgp) => ({
        ...tlgp,
        grammar_points: flattenGrammarPoint(tlgp.grammar_points),
      })),
    })),
  };
}

export async function createSpeaker(data: {
  slug: string;
  name_japanese?: string;
  image_url?: string;
  translations: Record<string, string>;
  descriptions?: Record<string, string>;
}) {
  const speaker = await speakersRepository.createSpeaker(data);
  return {
    ...speaker,
    translations: Object.fromEntries(
      speaker.translations.map((t) => [t.locale, { name: t.name, description: t.description }])
    ),
  };
}

export async function updateSpeaker(
  paramSlug: string,
  data: {
    slug: string;
    name_japanese?: string;
    image_url?: string;
    translations: Record<string, string>;
    descriptions?: Record<string, string>;
  }
) {
  const existing = await speakersRepository.findSpeakerIdBySlug(paramSlug);
  if (!existing) return null;

  const speaker = await speakersRepository.updateSpeaker(paramSlug, existing.id, data);
  return {
    ...speaker,
    translations: Object.fromEntries(
      speaker.translations.map((t) => [t.locale, { name: t.name, description: t.description }])
    ),
  };
}

export async function deleteSpeaker(slug: string) {
  return speakersRepository.deleteSpeaker(slug);
}

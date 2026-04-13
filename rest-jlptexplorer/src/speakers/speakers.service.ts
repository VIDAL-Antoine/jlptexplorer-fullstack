import { Injectable } from '@nestjs/common';
import {
  flattenSpeaker,
  flattenSource,
  flattenGrammarPoint,
} from '../utils/flatten';
import { SpeakersRepository } from './speakers.repository';

@Injectable()
export class SpeakersService {
  constructor(private readonly speakersRepository: SpeakersRepository) {}

  async listSpeakers(
    locale: string,
    options: { slug?: string; page: number; limit: number },
  ) {
    const { slug, page, limit } = options;
    const all = await this.speakersRepository.findSpeakers(locale);
    const mapped = all
      .map(flattenSpeaker)
      .filter((s) => !slug || s.slug === slug);
    const total = mapped.length;
    return {
      speakers: mapped.slice((page - 1) * limit, page * limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSpeaker(slug: string, locale: string) {
    const speaker = await this.speakersRepository.findSpeakerBySlug(
      slug,
      locale,
    );
    if (!speaker) return null;

    return {
      ...flattenSpeaker(speaker),
      transcript_lines: speaker.transcript_lines.map((line) => ({
        ...line,
        scenes: {
          ...line.scenes,
          sources: flattenSource(line.scenes.sources),
        },
        transcript_line_grammar_points: line.transcript_line_grammar_points.map(
          (tlgp) => ({
            ...tlgp,
            grammar_points: flattenGrammarPoint(tlgp.grammar_points),
          }),
        ),
      })),
    };
  }

  async createSpeaker(data: {
    slug: string;
    name_japanese?: string;
    image_url?: string;
    translations: Record<string, string>;
    descriptions?: Record<string, string>;
  }) {
    const speaker = await this.speakersRepository.createSpeaker(data);
    return {
      ...speaker,
      translations: Object.fromEntries(
        speaker.translations.map((t) => [
          t.locale,
          { name: t.name, description: t.description },
        ]),
      ),
    };
  }

  async updateSpeaker(
    paramSlug: string,
    data: {
      slug: string;
      name_japanese?: string;
      image_url?: string;
      translations: Record<string, string>;
      descriptions?: Record<string, string>;
    },
  ) {
    const existing = await this.speakersRepository.findSpeakerBySlug(
      paramSlug,
      'en',
    );
    if (!existing) return null;

    const speaker = await this.speakersRepository.updateSpeaker(
      paramSlug,
      existing.id,
      data,
    );
    return {
      ...speaker,
      translations: Object.fromEntries(
        speaker.translations.map((t) => [
          t.locale,
          { name: t.name, description: t.description },
        ]),
      ),
    };
  }

  async patchSpeaker(
    paramSlug: string,
    data: {
      slug?: string;
      name_japanese?: string;
      image_url?: string;
      translations?: Record<string, string>;
      descriptions?: Record<string, string>;
    },
  ) {
    const existing = await this.speakersRepository.findSpeakerBySlug(
      paramSlug,
      'en',
    );
    if (!existing) return null;

    const speaker = await this.speakersRepository.patchSpeaker(
      paramSlug,
      existing.id,
      data,
    );
    return {
      ...speaker,
      translations: Object.fromEntries(
        speaker.translations.map((t) => [
          t.locale,
          { name: t.name, description: t.description },
        ]),
      ),
    };
  }

  deleteSpeaker(slug: string) {
    return this.speakersRepository.deleteSpeaker(slug);
  }
}

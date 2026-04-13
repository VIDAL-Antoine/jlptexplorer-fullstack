import { BadRequestException, Injectable } from '@nestjs/common';
import { TranscriptLineGrammarPointsRepository } from './transcript-line-grammar-points.repository';
import { GrammarPointsRepository } from '../grammar-points/grammar-points.repository';
import { TranscriptLinesRepository } from '../transcript-lines/transcript-lines.repository';

@Injectable()
export class TranscriptLineGrammarPointsService {
  constructor(
    private readonly tlgpRepository: TranscriptLineGrammarPointsRepository,
    private readonly grammarPointsRepository: GrammarPointsRepository,
    private readonly transcriptLinesRepository: TranscriptLinesRepository,
  ) {}

  private async resolveGrammarPointSlug(slug: string): Promise<number> {
    const points = await this.grammarPointsRepository.findGrammarPointsBySlugIn(
      [slug],
    );
    if (!points.length) {
      throw new BadRequestException(`Unknown grammar point slug: ${slug}`);
    }
    return points[0].id;
  }

  listTranscriptLineGrammarPoints(filters: { transcriptLineId?: number }) {
    return this.tlgpRepository.findAllTranscriptLineGrammarPoints(filters);
  }

  getTranscriptLineGrammarPointById(id: number) {
    return this.tlgpRepository.findTranscriptLineGrammarPointById(id);
  }

  async createTranscriptLineGrammarPoint(body: {
    transcript_line_id: number;
    grammar_point_slug: string;
    start_index: number;
    end_index: number;
    matched_form?: string;
  }) {
    const lineExists =
      await this.transcriptLinesRepository.findTranscriptLineByIdAll(
        body.transcript_line_id,
      );
    if (!lineExists) {
      throw new BadRequestException(
        `Unknown transcript line id: ${body.transcript_line_id}`,
      );
    }

    const grammarPointId = await this.resolveGrammarPointSlug(
      body.grammar_point_slug,
    );

    return this.tlgpRepository.createTranscriptLineGrammarPoint({
      transcript_line_id: body.transcript_line_id,
      grammar_point_id: grammarPointId,
      start_index: body.start_index,
      end_index: body.end_index,
      ...(body.matched_form !== undefined
        ? { matched_form: body.matched_form }
        : {}),
    });
  }

  async updateTranscriptLineGrammarPoint(
    id: number,
    body: {
      grammar_point_slug: string;
      start_index: number;
      end_index: number;
      matched_form?: string;
    },
  ) {
    const existing =
      await this.tlgpRepository.findTranscriptLineGrammarPointById(id);
    if (!existing) return null;

    const grammarPointId = await this.resolveGrammarPointSlug(
      body.grammar_point_slug,
    );

    return this.tlgpRepository.updateTranscriptLineGrammarPoint(id, {
      grammar_point_id: grammarPointId,
      start_index: body.start_index,
      end_index: body.end_index,
      matched_form: body.matched_form ?? null,
    });
  }

  async patchTranscriptLineGrammarPoint(
    id: number,
    body: {
      grammar_point_slug?: string;
      start_index?: number;
      end_index?: number;
      matched_form?: string;
    },
  ) {
    const existing =
      await this.tlgpRepository.findTranscriptLineGrammarPointById(id);
    if (!existing) return null;

    const grammarPointId = body.grammar_point_slug
      ? await this.resolveGrammarPointSlug(body.grammar_point_slug)
      : undefined;

    return this.tlgpRepository.updateTranscriptLineGrammarPoint(id, {
      ...(grammarPointId !== undefined
        ? { grammar_point_id: grammarPointId }
        : {}),
      ...(body.start_index !== undefined
        ? { start_index: body.start_index }
        : {}),
      ...(body.end_index !== undefined ? { end_index: body.end_index } : {}),
      ...(body.matched_form !== undefined
        ? { matched_form: body.matched_form }
        : {}),
    });
  }

  async deleteTranscriptLineGrammarPoint(id: number) {
    const existing =
      await this.tlgpRepository.findTranscriptLineGrammarPointById(id);
    if (!existing) return null;
    await this.tlgpRepository.deleteTranscriptLineGrammarPoint(id);
    return true;
  }
}

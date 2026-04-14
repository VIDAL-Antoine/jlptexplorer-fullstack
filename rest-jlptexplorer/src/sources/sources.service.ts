import { Injectable, NotFoundException } from '@nestjs/common';
import { SourcesRepository } from './sources.repository';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { QuerySourceDto } from './dto/query-source.dto';
import { QuerySourceScenesDto } from './dto/query-source-scenes.dto';

@Injectable()
export class SourcesService {
  constructor(private readonly repo: SourcesRepository) {}

  findAll(query: QuerySourceDto) {
    return this.repo.findAll({
      type: query.type,
      page: query.page ?? 1,
      limit: query.limit ?? 12,
    });
  }

  async findOne(slug: string) {
    const source = await this.repo.findBySlug(slug);
    if (!source) throw new NotFoundException(`Source "${slug}" not found`);
    return source;
  }

  async findScenes(slug: string, query: QuerySourceScenesDto) {
    const source = await this.findOne(slug);
    const grammarPointSlugs = query.grammar_points
      ? query.grammar_points.split(',').filter(Boolean)
      : [];
    return this.repo.findScenesBySlug(source.id, {
      grammarPointSlugs,
      grammarMatch: query.grammar_match ?? 'scene',
      page: query.page ?? 1,
      limit: query.limit ?? 12,
    });
  }

  create(dto: CreateSourceDto) {
    return this.repo.create(dto);
  }

  async update(slug: string, dto: UpdateSourceDto) {
    const existing = await this.findOne(slug);
    return this.repo.update(existing.id, dto);
  }

  async remove(slug: string) {
    const existing = await this.findOne(slug);
    return this.repo.remove(existing.id);
  }
}

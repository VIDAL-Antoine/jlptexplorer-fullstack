import { Injectable, NotFoundException } from '@nestjs/common';
import { GrammarPointsRepository } from './grammar-points.repository';
import { CreateGrammarPointDto } from './dto/create-grammar-point.dto';
import { UpdateGrammarPointDto } from './dto/update-grammar-point.dto';
import { QueryGrammarPointDto } from './dto/query-grammar-point.dto';
import { QueryGrammarPointScenesDto } from './dto/query-grammar-point-scenes.dto';

@Injectable()
export class GrammarPointsService {
  constructor(private readonly repo: GrammarPointsRepository) {}

  findAll(query: QueryGrammarPointDto) {
    return this.repo.findAll({
      jlpt_level: query.jlpt_level,
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    });
  }

  async findOne(slug: string) {
    const gp = await this.repo.findBySlug(slug);
    if (!gp) throw new NotFoundException(`Grammar point "${slug}" not found`);
    return gp;
  }

  async findScenes(slug: string, query: QueryGrammarPointScenesDto) {
    await this.findOne(slug);
    const sourceSlugs = query.sources
      ? query.sources.split(',').filter(Boolean)
      : [];
    return this.repo.findScenesBySlug(slug, {
      sourceSlugs,
      page: query.page ?? 1,
      limit: query.limit ?? 12,
    });
  }

  create(dto: CreateGrammarPointDto) {
    return this.repo.create(dto);
  }

  async update(slug: string, dto: UpdateGrammarPointDto) {
    const existing = await this.findOne(slug);
    return this.repo.update(existing.id, dto);
  }

  async remove(slug: string) {
    const existing = await this.findOne(slug);
    return this.repo.remove(existing.id);
  }
}

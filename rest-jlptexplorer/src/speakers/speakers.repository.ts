import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { QuerySpeakerDto } from './dto/query-speaker.dto';

@Injectable()
export class SpeakersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySpeakerDto) {
    const { slug, page = 1, limit = 100 } = query;
    const where = slug ? { slug } : {};
    const [items, total] = await Promise.all([
      this.prisma.speakers.findMany({
        where,
        include: { translations: true },
        orderBy: { slug: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.speakers.count({ where }),
    ]);
    return { items, total };
  }

  findBySlug(slug: string) {
    return this.prisma.speakers.findUnique({
      where: { slug },
      include: { translations: true },
    });
  }

  create(dto: CreateSpeakerDto) {
    return this.prisma.speakers.create({
      data: {
        slug: dto.slug,
        name_japanese: dto.name_japanese ?? null,
        image_url: dto.image_url ?? null,
        translations: dto.translations
          ? { create: dto.translations }
          : undefined,
      },
      include: { translations: true },
    });
  }

  update(id: number, dto: UpdateSpeakerDto) {
    const { translations, ...fields } = dto;
    return this.prisma.speakers.update({
      where: { id },
      data: {
        ...fields,
        translations: translations
          ? {
              upsert: translations.map((t) => ({
                where: {
                  speaker_id_locale: {
                    speaker_id: id,
                    locale: t.locale,
                  },
                },
                update: { name: t.name, description: t.description },
                create: { locale: t.locale, name: t.name, description: t.description },
              })),
            }
          : undefined,
      },
      include: { translations: true },
    });
  }

  remove(id: number) {
    return this.prisma.speakers.delete({ where: { id } });
  }
}

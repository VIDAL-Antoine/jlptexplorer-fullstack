import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';
import { SpeakersService } from './speakers.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { UpdateSpeakerDto } from './dto/update-speaker.dto';
import { QuerySpeakerDto } from './dto/query-speaker.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('speakers')
@Controller('speakers')
export class SpeakersController {
  constructor(private readonly speakersService: SpeakersService) {}

  @ApiOperation({ summary: 'List all speakers' })
  @Get()
  findAll(@Query() query: QuerySpeakerDto) {
    return this.speakersService.findAll(query);
  }

  @ApiOperation({ summary: 'Get a speaker by slug' })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.speakersService.findOne(slug);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Create a speaker' })
  @Post()
  create(@Body() createSpeakerDto: CreateSpeakerDto) {
    return this.speakersService.create(createSpeakerDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Replace a speaker (full update)' })
  @Put(':slug')
  replace(
    @Param('slug') slug: string,
    @Body() updateSpeakerDto: UpdateSpeakerDto,
  ) {
    return this.speakersService.update(slug, updateSpeakerDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Partially update a speaker' })
  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateSpeakerDto: UpdateSpeakerDto,
  ) {
    return this.speakersService.update(slug, updateSpeakerDto);
  }

  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Delete a speaker' })
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.speakersService.remove(slug);
  }
}

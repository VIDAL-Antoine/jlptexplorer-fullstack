import { type JlptLevel } from '@/constants/jlpt';

export type SourceTranslation = {
  id: number;
  source_id: number;
  locale: string;
  title: string;
};

export type SpeakerTranslation = {
  id: number;
  speaker_id: number;
  locale: string;
  name: string;
  description: string | null;
};

export type GrammarPointTranslation = {
  id: number;
  grammar_point_id: number;
  locale: string;
  meaning: string;
  notes: string | null;
};

export type TranscriptLineTranslation = {
  id: number;
  transcript_line_id: number;
  locale: string;
  translation: string | null;
};

export type GrammarPoint = {
  id: number;
  slug: string;
  title: string;
  romaji: string;
  jlpt_level: JlptLevel;
  translations: GrammarPointTranslation[];
  has_scenes?: boolean;
};

export type Source = {
  id: number;
  slug: string;
  type: 'game' | 'anime' | 'movie' | 'series' | 'music';
  cover_image_url: string | null;
  japanese_title: string | null;
  translations: SourceTranslation[];
};

export type Speaker = {
  id: number;
  slug: string;
  name_japanese: string | null;
  image_url: string | null;
  translations: SpeakerTranslation[];
};

export type TranscriptLineGrammarPoint = {
  id: number;
  transcript_line_id: number;
  grammar_point_id: number;
  start_index: number | null;
  end_index: number | null;
  matched_form: string | null;
  grammar_points: GrammarPoint;
};

export type TranscriptLine = {
  id: number;
  scene_id: number;
  start_time: number | null;
  speaker_id: number | null;
  speakers: Speaker | null;
  japanese_text: string;
  translations: TranscriptLineTranslation[];
  transcript_line_grammar_points: TranscriptLineGrammarPoint[];
};

export type Scene = {
  id: number;
  source_id: number;
  youtube_video_id: string;
  start_time: number;
  end_time: number;
  episode_number: number;
  notes: string | null;
};

export type SceneWithDetails = Scene & {
  sources: Source;
  transcript_lines: TranscriptLine[];
};

export type Paginated<T> = {
  items: T[];
  total: number;
};

export type GrammarPointsPage = Paginated<GrammarPoint>;

export type GrammarPointScenesPage = Paginated<SceneWithDetails> & {
  availableSources: Source[];
};

export type ScenesPage = Paginated<SceneWithDetails> & {
  availableSources: Source[];
  availableGrammarPoints: GrammarPoint[];
};

export type SourcesPage = Paginated<Source>;

export type SourceScenesPage = Paginated<SceneWithDetails> & {
  availableGrammarPoints: GrammarPoint[];
};

export type SpeakersPage = Paginated<Speaker>;

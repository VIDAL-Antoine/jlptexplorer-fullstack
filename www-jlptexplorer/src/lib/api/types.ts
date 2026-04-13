import { type JlptLevel } from '@/constants/jlpt';

export type GrammarPoint = {
  id: number;
  slug: string;
  title: string;
  romaji: string;
  meaning: string | null;
  jlpt_level: JlptLevel;
  notes: string | null;
  created_at: string;
  has_scenes: boolean;
};

export type Source = {
  id: number;
  slug: string;
  title: string | null;
  japanese_title: string | null;
  type: 'game' | 'anime' | 'movie' | 'series' | 'music';
  cover_image_url: string | null;
  created_at: string;
};

export type Speaker = {
  id: number;
  slug: string;
  name: string | null;
  name_japanese: string | null;
  description: string | null;
  image_url: string | null;
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
  translation: string | null;
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
  created_at: string;
};

export type SceneWithDetails = Scene & {
  sources: Source;
  transcript_lines: TranscriptLine[];
};

export type GrammarPointsPage = {
  grammar_points: GrammarPoint[];
  total: number;
  page: number;
  totalPages: number;
};

export type GrammarPointDetail = GrammarPoint & {
  scenes_count: number;
  available_sources: Source[];
};

export type GrammarPointScenesPage = {
  scenes: SceneWithDetails[];
  total: number;
  page: number;
  totalPages: number;
  available_sources: Source[];
};

export type SourcesPage = {
  sources: Source[];
  total: number;
  page: number;
  totalPages: number;
  available_types: Source['type'][];
};

export type SourceDetail = Source & {
  scenes_count: number;
  grammar_points: GrammarPoint[];
};

export type SourceScenesPage = {
  scenes: SceneWithDetails[];
  total: number;
  page: number;
  totalPages: number;
  available_grammar_points: GrammarPoint[];
};

export type ScenesPage = {
  scenes: SceneWithDetails[];
  total: number;
  page: number;
  totalPages: number;
  available_sources: Source[];
  available_grammar_points: GrammarPoint[];
};

export type SpeakersPage = {
  speakers: Speaker[];
  total: number;
  page: number;
  totalPages: number;
};

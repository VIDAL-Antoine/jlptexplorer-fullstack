import type {
  GrammarPoint,
  GrammarPointDetail,
  GrammarPointsPage,
  SceneWithDetails,
  ScenesPage,
  Source,
  SourceDetail,
  SourcesPage,
  Speaker,
  TranscriptLine,
  TranscriptLineGrammarPoint,
} from '../src/lib/api/types';

// --- Speakers ---

export const speakerGoku: Speaker = {
  id: 1,
  slug: 'goku',
  name: 'Goku',
  name_japanese: '孫悟空',
  description: 'Main protagonist of Dragon Ball Z',
  image_url: null,
};

export const speakerVegeta: Speaker = {
  id: 2,
  slug: 'vegeta',
  name: 'Vegeta',
  name_japanese: 'ベジータ',
  description: 'Prince of the Saiyans',
  image_url: null,
};

export const speakerKrillin: Speaker = {
  id: 3,
  slug: 'krillin',
  name: 'Krillin',
  name_japanese: 'クリリン',
  description: "Goku's best friend",
  image_url: null,
};

export const speakerCloud: Speaker = {
  id: 4,
  slug: 'cloud',
  name: 'Cloud Strife',
  name_japanese: 'クラウド・ストライフ',
  description: 'Main protagonist of Final Fantasy VII',
  image_url: null,
};

// --- Grammar Points ---

export const gpWaTopic: GrammarPoint = {
  id: 1,
  slug: 'wa-topic',
  title: 'は',
  romaji: 'wa',
  meaning: 'topic marker particle',
  jlpt_level: 'N5',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpGaSubject: GrammarPoint = {
  id: 2,
  slug: 'ga-subject-marker',
  title: 'が',
  romaji: 'ga',
  meaning: 'subject marker particle',
  jlpt_level: 'N5',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpWoObject: GrammarPoint = {
  id: 3,
  slug: 'wo-object',
  title: 'を',
  romaji: 'wo',
  meaning: 'object marker particle',
  jlpt_level: 'N5',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpTeIru: GrammarPoint = {
  id: 4,
  slug: 'te-iru',
  title: 'ている',
  romaji: 'te iru',
  meaning: 'ongoing action or resultant state',
  jlpt_level: 'N5',
  notes: 'Also used for habitual actions.',
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpTaPast: GrammarPoint = {
  id: 5,
  slug: 'ta-past',
  title: 'た',
  romaji: 'ta',
  meaning: 'plain past tense',
  jlpt_level: 'N5',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpNaiNegative: GrammarPoint = {
  id: 6,
  slug: 'nai-negative',
  title: 'ない',
  romaji: 'nai',
  meaning: 'negative form of verbs',
  jlpt_level: 'N5',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpToConditional: GrammarPoint = {
  id: 7,
  slug: 'to-conditional',
  title: 'と',
  romaji: 'to',
  meaning: 'inevitable/habitual conditional: when, if',
  jlpt_level: 'N4',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpNDa: GrammarPoint = {
  id: 8,
  slug: 'n-da',
  title: 'んだ',
  romaji: 'n da',
  meaning: 'explanatory or emphasis: it is that...',
  jlpt_level: 'N4',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: false,
};

export const gpTaraCond: GrammarPoint = {
  id: 9,
  slug: 'tara-conditional',
  title: 'たら',
  romaji: 'tara',
  meaning: 'conditional: if/when (after completion)',
  jlpt_level: 'N4',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpNodeBecause: GrammarPoint = {
  id: 10,
  slug: 'node-because',
  title: 'ので',
  romaji: 'node',
  meaning: 'because, since (polite reason)',
  jlpt_level: 'N4',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpSouDa: GrammarPoint = {
  id: 11,
  slug: 'sou-da-appearance',
  title: 'そうだ',
  romaji: 'sou da',
  meaning: 'looks like, seems like (based on appearance)',
  jlpt_level: 'N3',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const gpBaConditional: GrammarPoint = {
  id: 12,
  slug: 'ba-conditional',
  title: 'ば',
  romaji: 'ba',
  meaning: 'conditional: if (hypothetical)',
  jlpt_level: 'N3',
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  has_scenes: true,
};

export const allGrammarPoints: GrammarPoint[] = [
  gpWaTopic,
  gpGaSubject,
  gpWoObject,
  gpTeIru,
  gpTaPast,
  gpNaiNegative,
  gpToConditional,
  gpNDa,
  gpTaraCond,
  gpNodeBecause,
  gpSouDa,
  gpBaConditional,
];

export const gpWaTopicDetail: GrammarPointDetail = {
  ...gpWaTopic,
  scenes_count: 42,
  available_sources: [],
};

export const gpTeIruDetail: GrammarPointDetail = {
  ...gpTeIru,
  scenes_count: 17,
  available_sources: [],
};

// --- Sources ---

export const sourceDragonBallZ: Source = {
  id: 1,
  slug: 'dragon-ball-z',
  title: 'Dragon Ball Z',
  japanese_title: 'ドラゴンボールZ',
  type: 'anime',
  cover_image_url: 'https://placehold.co/400x600?text=DBZ',
  created_at: '2024-01-01T00:00:00.000Z',
};

export const sourceDragonBall: Source = {
  id: 2,
  slug: 'dragon-ball',
  title: 'Dragon Ball',
  japanese_title: 'ドラゴンボール',
  type: 'anime',
  cover_image_url: 'https://placehold.co/400x600?text=DB',
  created_at: '2024-01-01T00:00:00.000Z',
};

export const sourceFinalFantasyVII: Source = {
  id: 3,
  slug: 'final-fantasy-vii',
  title: 'Final Fantasy VII',
  japanese_title: 'ファイナルファンタジーVII',
  type: 'game',
  cover_image_url: 'https://placehold.co/400x600?text=FF7',
  created_at: '2024-01-01T00:00:00.000Z',
};

export const sourceTekken4: Source = {
  id: 4,
  slug: 'tekken-4',
  title: 'Tekken 4',
  japanese_title: '鉄拳4',
  type: 'game',
  cover_image_url: 'https://placehold.co/400x600?text=T4',
  created_at: '2024-01-01T00:00:00.000Z',
};

export const allSources: Source[] = [
  sourceDragonBallZ,
  sourceDragonBall,
  sourceFinalFantasyVII,
  sourceTekken4,
];

export const sourceDragonBallZDetail: SourceDetail = {
  ...sourceDragonBallZ,
  scenes_count: 24,
  grammar_points: [gpWaTopic, gpGaSubject, gpTeIru, gpTaPast],
};

export const sourceFinalFantasyVIIDetail: SourceDetail = {
  ...sourceFinalFantasyVII,
  scenes_count: 8,
  grammar_points: [gpWaTopic, gpNaiNegative],
};

// --- Transcript line grammar points ---

const tlgpWa: TranscriptLineGrammarPoint = {
  id: 1,
  transcript_line_id: 1,
  grammar_point_id: 1,
  start_index: 5,
  end_index: 6,
  matched_form: 'は',
  grammar_points: gpWaTopic,
};

const tlgpWo: TranscriptLineGrammarPoint = {
  id: 2,
  transcript_line_id: 1,
  grammar_point_id: 3,
  start_index: 11,
  end_index: 12,
  matched_form: 'を',
  grammar_points: gpWoObject,
};

const tlgpTeIru: TranscriptLineGrammarPoint = {
  id: 3,
  transcript_line_id: 1,
  grammar_point_id: 4,
  start_index: 12,
  end_index: 18,
  matched_form: '持っていない',
  grammar_points: gpTeIru,
};

const tlgpNai: TranscriptLineGrammarPoint = {
  id: 4,
  transcript_line_id: 1,
  grammar_point_id: 6,
  start_index: 12,
  end_index: 18,
  matched_form: '持っていない',
  grammar_points: gpNaiNegative,
};

// --- Transcript Lines ---

export const transcriptLine1: TranscriptLine = {
  id: 1,
  scene_id: 1,
  start_time: 122,
  speaker_id: 3,
  speakers: speakerKrillin,
  japanese_text: '超サイヤ人は穏やかな心を持っていないとなれなかったんじゃないのか？',
  translation: "Wasn't it said that you can't become a Super Saiyan without a calm heart?",
  transcript_line_grammar_points: [tlgpWa, tlgpWo, tlgpTeIru, tlgpNai],
};

export const transcriptLine2: TranscriptLine = {
  id: 2,
  scene_id: 1,
  start_time: 135,
  speaker_id: 1,
  speakers: speakerGoku,
  japanese_text: '俺はただ強くなりたかっただけだ。',
  translation: 'I just wanted to get stronger.',
  transcript_line_grammar_points: [],
};

export const transcriptLineCloud: TranscriptLine = {
  id: 3,
  scene_id: 2,
  start_time: 42,
  speaker_id: 4,
  speakers: speakerCloud,
  japanese_text: '俺は興味ない。',
  translation: "I'm not interested.",
  transcript_line_grammar_points: [],
};

// --- Scenes ---

export const sceneWithTranscript: SceneWithDetails = {
  id: 1,
  source_id: 1,
  youtube_video_id: 'LzHaHLdpOVI',
  start_time: 117,
  end_time: 148,
  episode_number: 129,
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  sources: sourceDragonBallZ,
  transcript_lines: [transcriptLine1, transcriptLine2],
};

export const sceneFF7: SceneWithDetails = {
  id: 2,
  source_id: 3,
  youtube_video_id: 'dDt7R05OUGY',
  start_time: 10,
  end_time: 40,
  episode_number: 0,
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  sources: sourceFinalFantasyVII,
  transcript_lines: [transcriptLineCloud],
};

export const sceneTekken4: SceneWithDetails = {
  id: 3,
  source_id: 4,
  youtube_video_id: 'Xlb0W_8Jy0A',
  start_time: 5,
  end_time: 35,
  episode_number: 0,
  notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  sources: sourceTekken4,
  transcript_lines: [],
};

export const allScenes: SceneWithDetails[] = [sceneWithTranscript, sceneFF7, sceneTekken4];

// --- API response pages ---

export const sourcesPageResponse: SourcesPage = {
  sources: allSources,
  total: allSources.length,
  page: 1,
  totalPages: 1,
  available_types: ['anime', 'game'],
};

export const grammarPointsPageResponse: GrammarPointsPage = {
  grammar_points: allGrammarPoints,
  total: allGrammarPoints.length,
  page: 1,
  totalPages: 1,
};

export const scenesPageResponse: ScenesPage = {
  scenes: allScenes,
  total: allScenes.length,
  page: 1,
  totalPages: 1,
  available_sources: allSources,
  available_grammar_points: allGrammarPoints,
};

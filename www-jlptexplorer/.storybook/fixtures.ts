import type {
  GrammarPoint,
  GrammarPointsPage,
  ScenesPage,
  SceneWithDetails,
  Source,
  SourcesPage,
  Speaker,
  TranscriptLine,
  TranscriptLineGrammarPoint,
} from '../src/lib/api/types';

// --- Speakers ---

export const speakerGoku: Speaker = {
  id: 1,
  slug: 'goku',
  name_japanese: '孫悟空',
  image_url: null,
  translations: [
    { id: 1, speaker_id: 1, locale: 'en', name: 'Goku', description: 'Main protagonist of Dragon Ball Z' },
    { id: 2, speaker_id: 1, locale: 'fr', name: 'Goku', description: 'Personnage principal de Dragon Ball Z' },
  ],
};

export const speakerVegeta: Speaker = {
  id: 2,
  slug: 'vegeta',
  name_japanese: 'ベジータ',
  image_url: null,
  translations: [
    { id: 3, speaker_id: 2, locale: 'en', name: 'Vegeta', description: 'Prince of the Saiyans' },
    { id: 4, speaker_id: 2, locale: 'fr', name: 'Vegeta', description: 'Prince des Saiyans' },
  ],
};

export const speakerKrillin: Speaker = {
  id: 3,
  slug: 'krillin',
  name_japanese: 'クリリン',
  image_url: null,
  translations: [
    { id: 5, speaker_id: 3, locale: 'en', name: 'Krillin', description: "Goku's best friend" },
    { id: 6, speaker_id: 3, locale: 'fr', name: 'Krillin', description: 'Meilleur ami de Goku' },
  ],
};

export const speakerCloud: Speaker = {
  id: 4,
  slug: 'cloud',
  name_japanese: 'クラウド・ストライフ',
  image_url: null,
  translations: [
    { id: 7, speaker_id: 4, locale: 'en', name: 'Cloud Strife', description: 'Main protagonist of Final Fantasy VII' },
    { id: 8, speaker_id: 4, locale: 'fr', name: 'Cloud Strife', description: 'Personnage principal de Final Fantasy VII' },
  ],
};

// --- Grammar Points ---

export const gpWaTopic: GrammarPoint = {
  id: 1,
  slug: 'wa-topic',
  title: 'は',
  romaji: 'wa',
  jlpt_level: 'N5',
  has_scenes: true,
  translations: [
    { id: 1, grammar_point_id: 1, locale: 'en', meaning: 'topic marker particle', notes: null },
    { id: 2, grammar_point_id: 1, locale: 'fr', meaning: 'marqueur de thème', notes: null },
  ],
};

export const gpGaSubject: GrammarPoint = {
  id: 2,
  slug: 'ga-subject-marker',
  title: 'が',
  romaji: 'ga',
  jlpt_level: 'N5',
  has_scenes: true,
  translations: [
    { id: 3, grammar_point_id: 2, locale: 'en', meaning: 'subject marker particle', notes: null },
    { id: 4, grammar_point_id: 2, locale: 'fr', meaning: 'marqueur de sujet', notes: null },
  ],
};

export const gpWoObject: GrammarPoint = {
  id: 3,
  slug: 'wo-object',
  title: 'を',
  romaji: 'wo',
  jlpt_level: 'N5',
  has_scenes: true,
  translations: [
    { id: 5, grammar_point_id: 3, locale: 'en', meaning: 'object marker particle', notes: null },
    { id: 6, grammar_point_id: 3, locale: 'fr', meaning: "marqueur d'objet", notes: null },
  ],
};

export const gpTeIru: GrammarPoint = {
  id: 4,
  slug: 'te-iru',
  title: 'ている',
  romaji: 'te iru',
  jlpt_level: 'N5',
  has_scenes: true,
  translations: [
    { id: 7, grammar_point_id: 4, locale: 'en', meaning: 'ongoing action or resultant state', notes: 'Also used for habitual actions.' },
    { id: 8, grammar_point_id: 4, locale: 'fr', meaning: 'action en cours ou état résultant', notes: 'Utilisé aussi pour les actions habituelles.' },
  ],
};

export const gpTaPast: GrammarPoint = {
  id: 5,
  slug: 'ta-past',
  title: 'た',
  romaji: 'ta',
  jlpt_level: 'N5',
  has_scenes: true,
  translations: [
    { id: 9, grammar_point_id: 5, locale: 'en', meaning: 'plain past tense', notes: null },
    { id: 10, grammar_point_id: 5, locale: 'fr', meaning: 'forme passée simple', notes: null },
  ],
};

export const gpNaiNegative: GrammarPoint = {
  id: 6,
  slug: 'nai-negative',
  title: 'ない',
  romaji: 'nai',
  jlpt_level: 'N5',
  has_scenes: true,
  translations: [
    { id: 11, grammar_point_id: 6, locale: 'en', meaning: 'negative form of verbs', notes: null },
    { id: 12, grammar_point_id: 6, locale: 'fr', meaning: 'forme négative des verbes', notes: null },
  ],
};

export const gpToConditional: GrammarPoint = {
  id: 7,
  slug: 'to-conditional',
  title: 'と',
  romaji: 'to',
  jlpt_level: 'N4',
  has_scenes: true,
  translations: [
    { id: 13, grammar_point_id: 7, locale: 'en', meaning: 'inevitable/habitual conditional: when, if', notes: null },
    { id: 14, grammar_point_id: 7, locale: 'fr', meaning: 'conditionnel inévitable : quand, si', notes: null },
  ],
};

export const gpNDa: GrammarPoint = {
  id: 8,
  slug: 'n-da',
  title: 'んだ',
  romaji: 'n da',
  jlpt_level: 'N4',
  has_scenes: false,
  translations: [
    { id: 15, grammar_point_id: 8, locale: 'en', meaning: 'explanatory or emphasis: it is that...', notes: null },
    { id: 16, grammar_point_id: 8, locale: 'fr', meaning: "explication ou emphase : c'est que...", notes: null },
  ],
};

export const gpTaraCond: GrammarPoint = {
  id: 9,
  slug: 'tara-conditional',
  title: 'たら',
  romaji: 'tara',
  jlpt_level: 'N4',
  has_scenes: true,
  translations: [
    { id: 17, grammar_point_id: 9, locale: 'en', meaning: 'conditional: if/when (after completion)', notes: null },
    { id: 18, grammar_point_id: 9, locale: 'fr', meaning: 'conditionnel : si/quand (après accomplissement)', notes: null },
  ],
};

export const gpNodeBecause: GrammarPoint = {
  id: 10,
  slug: 'node-because',
  title: 'ので',
  romaji: 'node',
  jlpt_level: 'N4',
  has_scenes: true,
  translations: [
    { id: 19, grammar_point_id: 10, locale: 'en', meaning: 'because, since (polite reason)', notes: null },
    { id: 20, grammar_point_id: 10, locale: 'fr', meaning: 'parce que, car (raison polie)', notes: null },
  ],
};

export const gpSouDa: GrammarPoint = {
  id: 11,
  slug: 'sou-da-appearance',
  title: 'そうだ',
  romaji: 'sou da',
  jlpt_level: 'N3',
  has_scenes: true,
  translations: [
    { id: 21, grammar_point_id: 11, locale: 'en', meaning: 'looks like, seems like (based on appearance)', notes: null },
    { id: 22, grammar_point_id: 11, locale: 'fr', meaning: "a l'air de, semble (basé sur l'apparence)", notes: null },
  ],
};

export const gpBaConditional: GrammarPoint = {
  id: 12,
  slug: 'ba-conditional',
  title: 'ば',
  romaji: 'ba',
  jlpt_level: 'N3',
  has_scenes: true,
  translations: [
    { id: 23, grammar_point_id: 12, locale: 'en', meaning: 'conditional: if (hypothetical)', notes: null },
    { id: 24, grammar_point_id: 12, locale: 'fr', meaning: 'conditionnel : si (hypothétique)', notes: null },
  ],
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

// --- Sources ---

export const sourceDragonBallZ: Source = {
  id: 1,
  slug: 'dragon-ball-z',
  japanese_title: 'ドラゴンボールZ',
  type: 'anime',
  cover_image_url: 'https://placehold.co/400x600?text=DBZ',
  translations: [
    { id: 1, source_id: 1, locale: 'en', title: 'Dragon Ball Z' },
    { id: 2, source_id: 1, locale: 'fr', title: 'Dragon Ball Z' },
  ],
};

export const sourceDragonBall: Source = {
  id: 2,
  slug: 'dragon-ball',
  japanese_title: 'ドラゴンボール',
  type: 'anime',
  cover_image_url: 'https://placehold.co/400x600?text=DB',
  translations: [
    { id: 3, source_id: 2, locale: 'en', title: 'Dragon Ball' },
    { id: 4, source_id: 2, locale: 'fr', title: 'Dragon Ball' },
  ],
};

export const sourceFinalFantasyVII: Source = {
  id: 3,
  slug: 'final-fantasy-vii',
  japanese_title: 'ファイナルファンタジーVII',
  type: 'game',
  cover_image_url: 'https://placehold.co/400x600?text=FF7',
  translations: [
    { id: 5, source_id: 3, locale: 'en', title: 'Final Fantasy VII' },
    { id: 6, source_id: 3, locale: 'fr', title: 'Final Fantasy VII' },
  ],
};

export const sourceTekken4: Source = {
  id: 4,
  slug: 'tekken-4',
  japanese_title: '鉄拳4',
  type: 'game',
  cover_image_url: null,
  translations: [
    { id: 7, source_id: 4, locale: 'en', title: 'Tekken 4' },
    { id: 8, source_id: 4, locale: 'fr', title: 'Tekken 4' },
  ],
};

export const allSources: Source[] = [
  sourceDragonBallZ,
  sourceDragonBall,
  sourceFinalFantasyVII,
  sourceTekken4,
];

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
  translations: [
    { id: 1, transcript_line_id: 1, locale: 'en', translation: "Wasn't it said that you can't become a Super Saiyan without a calm heart?" },
    { id: 2, transcript_line_id: 1, locale: 'fr', translation: "N'était-il pas dit qu'on ne peut pas devenir Super Saiyan sans avoir un cœur calme ?" },
  ],
  transcript_line_grammar_points: [tlgpWa, tlgpWo, tlgpTeIru, tlgpNai],
};

export const transcriptLine2: TranscriptLine = {
  id: 2,
  scene_id: 1,
  start_time: 135,
  speaker_id: 1,
  speakers: speakerGoku,
  japanese_text: '俺はただ強くなりたかっただけだ。',
  translations: [
    { id: 3, transcript_line_id: 2, locale: 'en', translation: 'I just wanted to get stronger.' },
    { id: 4, transcript_line_id: 2, locale: 'fr', translation: 'Je voulais juste devenir plus fort.' },
  ],
  transcript_line_grammar_points: [],
};

export const transcriptLineCloud: TranscriptLine = {
  id: 3,
  scene_id: 2,
  start_time: 42,
  speaker_id: 4,
  speakers: speakerCloud,
  japanese_text: '俺は興味ない。',
  translations: [
    { id: 5, transcript_line_id: 3, locale: 'en', translation: "I'm not interested." },
    { id: 6, transcript_line_id: 3, locale: 'fr', translation: "Je ne suis pas intéressé." },
  ],
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
  sources: sourceTekken4,
  transcript_lines: [],
};

export const allScenes: SceneWithDetails[] = [sceneWithTranscript, sceneFF7, sceneTekken4];

// --- API response pages ---

export const sourcesPageResponse: SourcesPage = {
  items: allSources,
  total: allSources.length,
};

export const grammarPointsPageResponse: GrammarPointsPage = {
  items: allGrammarPoints,
  total: allGrammarPoints.length,
};

export const scenesPageResponse: ScenesPage = {
  items: allScenes,
  total: allScenes.length,
  availableSources: allSources,
  availableGrammarPoints: allGrammarPoints,
};

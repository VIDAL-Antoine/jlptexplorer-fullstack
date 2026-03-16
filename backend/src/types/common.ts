export type LocaleParams = { locale: string };

export type GrammarPointAnnotation = {
  slug: string;
  start_index?: number;
  end_index?: number;
  matched_form?: string;
};

export type TranscriptLineInput = {
  start_time?: number | string;
  speaker_slug?: string;
  text: string;
  translations?: Record<string, string>;
  grammar_points?: GrammarPointAnnotation[];
};

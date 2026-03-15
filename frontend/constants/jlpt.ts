export const JLPT_LEVEL_COLORS = {
  N5: 'indigo',
  N4: 'cyan',
  N3: 'green',
  N2: 'orange',
  N1: 'red',
} as const;

export type JlptLevel = keyof typeof JLPT_LEVEL_COLORS;

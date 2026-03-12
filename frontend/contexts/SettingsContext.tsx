'use client';

import { createContext, useContext } from 'react';
import { useLocalStorage } from '@mantine/hooks';

interface SettingsContextValue {
  speakerNameLang: 'english' | 'japanese';
  setSpeakerNameLang: (v: 'english' | 'japanese') => void;
  sourceTitleLang: 'english' | 'japanese';
  setSourceTitleLang: (v: 'english' | 'japanese') => void;
  showDialogueTranslations: boolean;
  setShowDialogueTranslations: (v: boolean) => void;
  showGrammarPointRomaji: boolean;
  setShowGrammarPointRomaji: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [speakerNameLang, setSpeakerNameLang] = useLocalStorage<'english' | 'japanese'>({
    key: 'setting-speaker-lang',
    defaultValue: 'japanese',
  });
  const [sourceTitleLang, setSourceTitleLang] = useLocalStorage<'english' | 'japanese'>({
    key: 'setting-source-title-lang',
    defaultValue: 'english',
  });
  const [showDialogueTranslations, setShowDialogueTranslations] = useLocalStorage({
    key: 'setting-show-dialogue-translations',
    defaultValue: true,
  });
  const [showGrammarPointRomaji, setShowGrammarPointRomaji] = useLocalStorage({
    key: 'setting-show-grammar-point-romaji',
    defaultValue: true,
  });

  return (
    <SettingsContext.Provider
      value={{
        speakerNameLang,
        setSpeakerNameLang,
        sourceTitleLang,
        setSourceTitleLang,
        showDialogueTranslations,
        setShowDialogueTranslations,
        showGrammarPointRomaji,
        setShowGrammarPointRomaji,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

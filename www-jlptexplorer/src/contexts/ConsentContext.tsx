'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import * as CookieConsent from 'vanilla-cookieconsent';
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';

interface ConsentContextValue {
  isYoutubeAccepted: boolean;
  showPreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  isYoutubeAccepted: false,
  showPreferences: () => {},
});

function buildTranslation(m: typeof en): CookieConsent.Translation {
  const c = m.CookieConsent;
  return {
    consentModal: c.consentModal,
    preferencesModal: {
      ...c.preferencesModal,
      sections: [
        { linkedCategory: 'necessary', ...c.preferencesModal.necessary },
        { linkedCategory: 'youtube', ...c.preferencesModal.youtube },
      ],
    },
  };
}

const translations: Record<string, CookieConsent.Translation> = {
  en: buildTranslation(en),
  fr: buildTranslation(fr),
};

let ccInitialized = false;

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const [isYoutubeAccepted, setIsYoutubeAccepted] = useState(false);

  useEffect(() => {
    if (ccInitialized) {
      CookieConsent.setLanguage(locale === 'fr' ? 'fr' : 'en');
      setIsYoutubeAccepted(CookieConsent.acceptedCategory('youtube'));
      return;
    }
    ccInitialized = true;

    CookieConsent.run({
      categories: {
        necessary: { enabled: true, readOnly: true },
        youtube: {},
      },
      language: {
        default: locale === 'fr' ? 'fr' : 'en',
        translations,
      },
      onConsent: () => {
        setIsYoutubeAccepted(CookieConsent.acceptedCategory('youtube'));
      },
      onChange: () => {
        setIsYoutubeAccepted(CookieConsent.acceptedCategory('youtube'));
      },
    });
    setIsYoutubeAccepted(CookieConsent.acceptedCategory('youtube'));
  }, [locale]);

  return (
    <ConsentContext.Provider
      value={{ isYoutubeAccepted, showPreferences: CookieConsent.showPreferences }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}

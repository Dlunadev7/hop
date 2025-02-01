import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

export const initializeI18next = async (language: string) => {
  await i18next
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: language.toLowerCase(),
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      ns: ['auth', 'utils', 'home'],
      resources,
      interpolation: {
        escapeValue: false,
      },
      debug: true,
    });
};

export default i18next;

import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';

import en from './translations/en.json';
import es from './translations/es.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
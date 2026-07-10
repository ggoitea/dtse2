import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from '../locales/es.json';
import en from '../locales/en.json';
import pt from '../locales/pt.json';
import qu from '../locales/qu.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    lng: 'es',
    supportedLngs: ['es', 'en', 'pt', 'qu'],
    debug: false,
    defaultNS: 'translation',
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: en,
        },
        es: {
            translation: es,
        },
        pt: {
            translation: pt,
        },
        qu: {
            translation: qu,
        },
    },
  });

export default i18n;
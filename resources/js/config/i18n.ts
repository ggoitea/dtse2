import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import commonEn from '../locales/en/common.json';
import landingEn from '../locales/en/landing.json';
import mapaEn from '../locales/en/mapa.json';
import novedadesEn from '../locales/en/novedades.json';
import commonEs from '../locales/es/common.json';
import landingEs from '../locales/es/landing.json';
import mapaEs from '../locales/es/mapa.json';
import novedadesEs from '../locales/es/novedades.json';
import commonPt from '../locales/pt/common.json';
import landingPt from '../locales/pt/landing.json';
import mapaPt from '../locales/pt/mapa.json';
import novedadesPt from '../locales/pt/novedades.json';
import commonQu from '../locales/qu/common.json';
import landingQu from '../locales/qu/landing.json';
import mapaQu from '../locales/qu/mapa.json';
import novedadesQu from '../locales/qu/novedades.json';

i18n.use(initReactI18next).init({
    fallbackLng: 'es',
    lng: 'es',
    supportedLngs: ['es', 'en', 'pt', 'qu'],
    debug: false,
    defaultNS: 'common',
    interpolation: {
        escapeValue: false,
    },
    resources: {
        es: {
            common: commonEs,
            landing: landingEs,
            novedades: novedadesEs,
            mapa: mapaEs,
        },
        en: {
            common: commonEn,
            landing: landingEn,
            novedades: novedadesEn,
            mapa: mapaEn,
        },
        pt: {
            common: commonPt,
            landing: landingPt,
            novedades: novedadesPt,
            mapa: mapaPt,
        },
        qu: {
            common: commonQu,
            landing: landingQu,
            novedades: novedadesQu,
            mapa: mapaQu,
        },
    },
});

export default i18n;

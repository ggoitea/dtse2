import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import commonEn from '../locales/en/common.json';
import eventosEn from '../locales/en/eventos.json';
import landingEn from '../locales/en/landing.json';
import mapaEn from '../locales/en/mapa.json';
import novedadesEn from '../locales/en/novedades.json';
import paquetesEn from '../locales/en/paquetes.json';
import commonEs from '../locales/es/common.json';
import eventosEs from '../locales/es/eventos.json';
import landingEs from '../locales/es/landing.json';
import mapaEs from '../locales/es/mapa.json';
import novedadesEs from '../locales/es/novedades.json';
import paquetesEs from '../locales/es/paquetes.json';
import commonPt from '../locales/pt/common.json';
import eventosPt from '../locales/pt/eventos.json';
import landingPt from '../locales/pt/landing.json';
import mapaPt from '../locales/pt/mapa.json';
import novedadesPt from '../locales/pt/novedades.json';
import paquetesPt from '../locales/pt/paquetes.json';
import commonQu from '../locales/qu/common.json';
import eventosQu from '../locales/qu/eventos.json';
import landingQu from '../locales/qu/landing.json';
import mapaQu from '../locales/qu/mapa.json';
import novedadesQu from '../locales/qu/novedades.json';
import paquetesQu from '../locales/qu/paquetes.json';

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
            eventos: eventosEs,
            paquetes: paquetesEs,
        },
        en: {
            common: commonEn,
            landing: landingEn,
            novedades: novedadesEn,
            mapa: mapaEn,
            eventos: eventosEn,
            paquetes: paquetesEn,
        },
        pt: {
            common: commonPt,
            landing: landingPt,
            novedades: novedadesPt,
            mapa: mapaPt,
            eventos: eventosPt,
            paquetes: paquetesPt,
        },
        qu: {
            common: commonQu,
            landing: landingQu,
            novedades: novedadesQu,
            mapa: mapaQu,
            eventos: eventosQu,
            paquetes: paquetesQu,
        },
    },
});

export default i18n;

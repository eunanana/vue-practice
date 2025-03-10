import { createI18n } from 'vue-i18n';
import enUS from "@/locales/en.json";
import koKR from "@/locales/ko.json";

const i18n = createI18n({
  // options
  locale: 'ko',
  fallbackLocale: 'ko', // 다국어 작동안될 시 사용 언어
  legacy: false, // script에서 사용할 경우 false
  messages: {
    en: enUS,
    ko: koKR
  }
});

export default i18n;
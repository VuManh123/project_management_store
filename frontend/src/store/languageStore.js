import { create } from 'zustand';
import i18n from '../i18n/config';

const useLanguageStore = create((set) => ({
  language: i18n.language || 'en',
  
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set({ language: lang });
    localStorage.setItem('i18nextLng', lang);
  },
  
  initLanguage: () => {
    const savedLang = localStorage.getItem('i18nextLng') || i18n.language || 'en';
    i18n.changeLanguage(savedLang);
    set({ language: savedLang });
  },
}));

export default useLanguageStore;


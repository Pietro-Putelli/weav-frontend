import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { updateProfileLanguage } from "../backend/profile";
import { changeLocale } from "../dates/localeUtils";
import { setUser } from "../store/slices/userReducer";
import { getLanguage } from "../store/store";
import { getSystemLanguage } from "../utility/locale";
import useUser from "./useUser";

const LANGUAGES = {
  en: require("../languages/english.json"),
  it: require("../languages/italian.json"),
};

const PLURALS_SOURCE = require("../languages/plurals.json");
const DATE_TIME_LANGUAGE = require("../dates/languages.json");

export const getLangugage = (code) => {
  return LANGUAGES[code];
};

const useLanguages = () => {
  const user = useUser();
  const language = user?.language || "en";

  const dispatch = useDispatch();

  /* Methods */

  /* Use to set system languange on first launch */
  const setupSystemLanguage = () => {
    const language = getSystemLanguage();

    dispatch(setUser({ language }));
  };

  const changeLanguage = (language) => {
    changeLocale(language);

    dispatch(updateProfileLanguage(language));
  };

  const languageContent = LANGUAGES[language];

  const greeting = useMemo(() => {
    let now = new Date();
    let hour = now.getHours();

    let index;

    if (hour >= 5 && hour < 12) {
      index = 0;
    } else if (hour >= 12 && hour < 18) {
      index = 1;
    } else if (hour >= 18 && hour < 22) {
      index = 2;
    } else {
      index = 3;
    }

    return languageContent.dayPeriods[index];
  }, [languageContent]);

  const getPluralAwareWord = ({ word, count = 0 }) => {
    const wordAt = PLURALS_SOURCE[language]?.[word];
    const wordIndex = count <= 1 ? 0 : 1;

    if (wordAt) {
      return wordAt[String(wordIndex)];
    }

    return word;
  };

  return {
    language,
    languageContent,
    greeting,
    locale: languageContent["locale"],
    dateTimeLanguageContent: DATE_TIME_LANGUAGE[language],
    languagesList: LANGUAGES[language]["languages"],
    changeLanguage,
    setupSystemLanguage,
    getPluralAwareWord,
  };
};

export default useLanguages;

export const getLanguageContent = () => {
  const language = getLanguage();
  return { languageContent: LANGUAGES[language], language };
};

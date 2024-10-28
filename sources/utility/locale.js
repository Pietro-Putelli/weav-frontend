import * as Localization from "expo-localization";

const LANGUAGES = ["en", "it"];

export const getSystemLanguage = () => {
  let language = Localization.locale.split("-")[0];

  if (!LANGUAGES.includes(language)) {
    language = "en";
  }

  return language;
};

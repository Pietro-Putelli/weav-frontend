import { momentlocale } from ".";

export const changeLocale = (newLocale) => {
  momentlocale.locale(newLocale);
};

export const is12HourFormat = () => {
  return momentlocale().localeData().longDateFormat("LT").includes("A");
};

export const translateDateTimeWords = (word) => {
  const languages = require("./languages.json");
  return languages[momentlocale().locale()][word];
};

export const getTimeFormat = () => {
  return momentlocale().localeData().longDateFormat("LT");
};

export const isAmPmTimeFormat = (time) => {
  return momentlocale(time, "HH:mm:ss").format("A") !== time;
};

import { getLanguageContent } from "../hooks/useLanguages";
import { getTimeFormatFor } from "./dateFormats";
import { getWeekDays } from "./functions";
import { is12HourFormat, translateDateTimeWords } from "./localeUtils";
import momentlocale from "./momentlocale";

/* Format data based on locale */
export const formatDate = ({ date, format }) => {
  return momentlocale(date).format(format);
};

export const formatMinutes = ({ minutes, abbr = false }) => {
  const { languageContent } = getLanguageContent();

  if (minutes < 1) {
    return languageContent.expired;
  }

  if (minutes < 60) {
    return minutes + " min";
  }

  const hours = Math.floor(minutes / 60);

  if (hours >= 24) {
    return "1 " + translateDateTimeWords("day");
  }

  if (hours == 1) {
    return hours + (abbr ? "h" : " " + translateDateTimeWords("hour"));
  }

  return hours + (abbr ? "h" : " " + translateDateTimeWords("hours"));
};

export const formatMomentDuration = (date) => {
  const now = momentlocale();
  const endAtDate = momentlocale(date);

  const diff = endAtDate.diff(now, "minutes");
  return formatMinutes({ minutes: diff, abbr: true });
};

/* Format time based on locale */
export const formatTime = ({ time, isPlain = false }) => {
  const currentTimeFormat = "HH:mm"; // getTimeFormat();
  const timeFormat = getTimeFormatFor(time);

  let stringTime = momentlocale(time, timeFormat)
    .format(currentTimeFormat)
    .toLowerCase();

  if (isPlain) {
    return String(stringTime).toUpperCase();
  }

  let ampmText = null;

  if (is12HourFormat()) {
    ampmText = stringTime.includes("am") ? "am" : "pm";
    stringTime = stringTime.replace(" am", "").replace(" pm", "");
  }

  return { time: stringTime, ampm: ampmText };
};

export const formatUTCDate = (date) => {
  return date.format("YYYY-MM-DD HH:mm:ss");
};

export const formatPeriodicDate = (date) => {
  const { languageContent } = getLanguageContent();

  if (date && date?.length > 2) {
    return `${languageContent.every} ${date}`;
  }

  return `${languageContent.every} ${getWeekDays()[date]}`;
};

export const formatTimeAgo = (createdAt) => {
  const now = momentlocale();
  const createdAtMoment = momentlocale(createdAt);
  const duration = momentlocale.duration(now.diff(createdAtMoment));

  const agoTitle = translateDateTimeWords("ago");

  const minutes = duration.asMinutes();

  if (minutes < 60) {
    return `${Math.floor(minutes)} min ${agoTitle}`;
  }

  const hours = Math.floor(duration.asHours());

  if (hours == 1) {
    return `${hours} ${translateDateTimeWords("hour")} ${agoTitle}`;
  }

  if (hours < 24) {
    return `${hours} ${translateDateTimeWords("hours")} ${agoTitle}`;
  }

  const days = duration.asDays();
  return `1 ${translateDateTimeWords("day")} ${agoTitle}`;
};

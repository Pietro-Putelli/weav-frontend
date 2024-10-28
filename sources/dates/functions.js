import moment from "moment";
import { momentlocale } from ".";
import { getLanguageContent } from "../hooks/useLanguages";
import { capitalizeAllFirstLetters } from "../utility/strings";
import { WEEK_DAYS } from "./constants";
import dateFormats, { getTimeFormatFor } from "./dateFormats";
import { formatDate } from "./formatters";
import { is12HourFormat, translateDateTimeWords } from "./localeUtils";
import { isNull } from "lodash";

export const getNext30Days = () => {
  const weekdays = [];

  for (let i = 0; i < 31; i++) {
    const nextDay = momentlocale().add(i, "days");
    weekdays.push(nextDay.format(dateFormats.YYYY_MM_DD));
  }

  return weekdays;
};

export const getToday = (format) => {
  return momentlocale().format(format ?? dateFormats.YYYY_MM_DD);
};

export const getTomorrow = () => {
  return momentlocale().add(1, "days").format(dateFormats.YYYY_MM_DD);
};

const isDateGreaterOrEqual = (date, time) => {
  const currentDate = momentlocale();
  const dateToCheck = momentlocale(date + " " + time, "YYYY-MM-DD HH:mm:ss");
  return currentDate.isSameOrAfter(dateToCheck);
};

export const getIsEventLive = ({ date, time, periodic_day }) => {
  if (!isNull(periodic_day)) {
    const currentDay = getCurrentDayIndex();

    if (currentDay == periodic_day) {
      const eventTime = momentlocale(time, "HH:mm:ss");
      const currentTime = momentlocale();

      if (currentTime.isSameOrAfter(eventTime)) {
        return true;
      }
    }
    return false;
  }

  return isDateGreaterOrEqual(date, time);
};

export const getEventRelativeDate = ({
  date,
  periodic_day,
  time,
  showSoonDate,
}) => {
  if (periodic_day) {
    const { languageContent } = getLanguageContent();

    const periodicDay = getWeekDays()[periodic_day];

    return `${languageContent.every} ${periodicDay}`;
  }

  const currentDate = momentlocale();
  const dateToCheck = momentlocale(date, "YYYY-MM-DD");
  const timeToCheck = momentlocale(time, "HH:mm:ss");

  const dayDiff = dateToCheck.diff(currentDate, "days", true);
  const hourDiff = Math.round(timeToCheck.diff(currentDate, "hours", true));

  // merge dateToCheck and timeToCheck
  const dateToCheckWithTime = momentlocale(
    date + " " + time,
    "YYYY-MM-DD HH:mm:ss"
  );

  const currentDateWithTime = momentlocale(
    currentDate.format(dateFormats.YYYY_MM_DD) +
      " " +
      currentDate.format("HH:mm:ss"),
    "YYYY-MM-DD HH:mm:ss"
  );

  const delta = dateToCheckWithTime.diff(currentDateWithTime, "minutes", true);

  if (dayDiff <= 0) {
    if (hourDiff <= 1 && delta > 0) {
      let result = translateDateTimeWords("startingSoon");

      if (showSoonDate) {
        const startingTime = momentlocale(time, "HH:mm:ss").format("HH:mm");
        result += " - " + startingTime;
      }

      return result;
    } else if (delta <= 0) {
      return "now";
    }

    return translateDateTimeWords("today");
  }

  if (dayDiff > 0 && dayDiff <= 1) {
    return translateDateTimeWords("tomorrow");
  }

  return capitalizeAllFirstLetters(
    formatDate({ date, format: dateFormats.ddd_D_MMM })
  );
};

export const getBase10MinuteDate = () => {
  const is24Hour = !is12HourFormat();

  const hourFormat = is24Hour ? "HH" : "hh";

  const minutes = momentlocale().minutes();
  const hours = momentlocale().format(hourFormat);
  const ampm = momentlocale().format("a");

  let newMinutes = String(Math.round(minutes / 10) * 10);

  if (newMinutes == "0") {
    newMinutes += "0";
  }

  let result = `${hours}:${newMinutes}`;

  if (!is24Hour) {
    result += ` ${ampm}`;
  }

  return result;
};

export const isTodayOrTomorrow = (date) => {
  const currentDate = momentlocale();
  const dateToCheck = momentlocale(date, "YYYY-MM-DD");

  const dayDiff = dateToCheck.diff(currentDate, "days", true);

  if (dayDiff <= 0) {
    return translateDateTimeWords("today");
  }

  if (dayDiff > 0 && dayDiff <= 1) {
    return translateDateTimeWords("tomorrow");
  }

  return null;
};

export const checkTimeConsistency = ({ start, end }) => {
  const timeFormat = getTimeFormatFor(start);
  const is24Hour = timeFormat.includes("HH");

  const hourFormat = is24Hour ? "HH" : "hh";

  const startHour = momentlocale(start, timeFormat).format(hourFormat);
  const startMinutes = momentlocale(start, timeFormat).minutes();

  const endHour = momentlocale(end, timeFormat).format(hourFormat);
  const endMinutes = momentlocale(end, timeFormat).minutes();

  if (startHour < endHour) {
    return true;
  }

  if (startHour == endHour && startMinutes < endMinutes) {
    return true;
  }

  return false;
};

export const getNowTime = () => {
  return momentlocale().format("HH:mm");
};

export const getYesterdayAndToday = () => {
  const index = Math.max(0, moment().isoWeekday() - 1) % 7;
  const beforeIndex = Math.max(0, index - 1);

  return { yesterday: WEEK_DAYS[beforeIndex], today: WEEK_DAYS[index] };
};

export const getCurrentUTCDate = () => {
  let currentDate = moment();

  currentDate = currentDate.format("YYYY-MM-DD HH:mm");
  currentDate = moment.utc(currentDate);

  return currentDate.format();
};

export const getWeekDays = () => {
  const { languageContent } = getLanguageContent();

  momentlocale.locale(languageContent.locale);

  const days = momentlocale.weekdays(true);
  const sundayIndex = days.findIndex((day) => day === "Sunday");
  const sunday = days.splice(sundayIndex, 1);
  days.push(sunday[0]);

  return days;
};

export const getWeekDayIndexFor = (day) => {
  const days = getWeekDays();
  return days.findIndex((d) => d === day);
};

/* Get days starting from Monday */
export const getCurrentDayIndex = () => {
  return moment().isoWeekday() - 1;
};

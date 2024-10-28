import { isEmpty, isNull, isUndefined, take } from "lodash";
import moment from "moment";
import { getLanguageContent } from "../hooks/useLanguages";
import { WEEK_DAYS } from "./constants";
import { formatUTCDate } from "./formatters";

const DATE_FORMAT = "YYYY-MM-DD HH:mm";
const HOUR_FORMAT = "HH:mm";

const getCurrentUTCDate = (day = 0) => {
  let currentDate = moment().set({ year: 2023, month: 0, date: 1 + day });

  currentDate = currentDate.format(DATE_FORMAT);
  currentDate = moment.utc(currentDate);

  return currentDate;
};

export const formatTimeTable = (timetable) => {
  return timetable.map((day, index) => {
    const dayKey = WEEK_DAYS[index];
    const dayTimetable = day[dayKey];

    if (isNull(dayTimetable)) {
      return day;
    }

    let newTimetable = [];

    /* First Timetable Section */

    let firstSection = take(dayTimetable, 2);

    let [firstFromDateString, firstToDateString] = firstSection.map((time) => {
      return moment(`2023-01-01 ${time}`, DATE_FORMAT).format(DATE_FORMAT);
    });

    let startDate = moment(firstFromDateString, DATE_FORMAT);
    let endDate = moment(firstToDateString, DATE_FORMAT);

    const startEndTimeDelta = startDate.diff(endDate, "minutes");

    if (startEndTimeDelta > 0) {
      endDate.add(1, "day");
    }

    firstFromDateString = startDate.format(DATE_FORMAT);
    firstToDateString = endDate.format(DATE_FORMAT);

    newTimetable = [firstFromDateString, firstToDateString];

    /* Second Timetable Section */

    let secondSection = dayTimetable.slice(2, 4);

    if (!isEmpty(secondSection)) {
      let [firstFromDateString, firstToDateString] = secondSection.map(
        (time) => {
          return moment(`2023-01-01 ${time}`, DATE_FORMAT).format(DATE_FORMAT);
        }
      );

      let startDate = moment(firstFromDateString, DATE_FORMAT);
      let endDate = moment(firstToDateString, DATE_FORMAT);

      const startEndTimeDelta = startDate.diff(endDate, "minutes");

      if (startEndTimeDelta > 0) {
        endDate.add(1, "day");
      }

      firstFromDateString = startDate.format(DATE_FORMAT);
      firstToDateString = endDate.format(DATE_FORMAT);

      newTimetable = [...newTimetable, firstFromDateString, firstToDateString];
    }

    return { [dayKey]: newTimetable };
  });
};

const getNextOpenDayContent = ({ timetable, todayIndex }) => {
  const { languageContent } = getLanguageContent();
  const language = languageContent.venue_timetable;

  let nextOpenDayIndex = 0;

  for (let i = todayIndex; i < todayIndex + 7; i++) {
    let index = i % 7;

    const dayTimetable = timetable[WEEK_DAYS[index]];

    if (!isEmpty(dayTimetable)) {
      if (todayIndex === index) {
        const venueCanOpenToday = canOpenToday(dayTimetable);

        if (venueCanOpenToday) {
          nextOpenDayIndex = index;
          break;
        }
      } else {
        nextOpenDayIndex = index;
        break;
      }
    }
  }

  const nextOpenDay = WEEK_DAYS?.[nextOpenDayIndex];

  if (isUndefined(nextOpenDay)) {
    return "";
  }

  const nextOpenDayOpenAt = timetable[WEEK_DAYS[nextOpenDayIndex]]?.[0];

  if (isUndefined(nextOpenDayOpenAt)) {
    return "";
  }

  const isTomorrow = nextOpenDayIndex === (todayIndex + 1) % 7;

  let openOnDay = nextOpenDay.capitalize();

  if (isTomorrow) {
    openOnDay = languageContent.tomorrow;
  } else if (nextOpenDayIndex === todayIndex) {
    openOnDay = languageContent.today;
  }

  return `${language.opens} ${openOnDay} ${language.at} ${moment
    .utc(nextOpenDayOpenAt)
    .format("HH:mm")}`;
};

const canOpenToday = (timetableSection) => {
  let [_, firstToDateString, secondFromDateString, secondToDateString] =
    timetableSection;

  let currentDate = getCurrentUTCDate();

  let endDate = moment.utc(firstToDateString);

  if (currentDate.isBefore(endDate)) {
    return true;
  } else if (currentDate.isSameOrAfter(endDate)) {
    /* currentDate is in second section */

    if (
      !isUndefined(secondFromDateString) &&
      !isUndefined(secondToDateString)
    ) {
      return true;
    }
  }

  return false;
};

export const isBusinessOpen = (timetable) => {
  const { languageContent } = getLanguageContent();
  const language = languageContent.venue_timetable;

  const todayIndex = Math.max(0, moment().isoWeekday() - 1) % 7;
  const yesterdayIndex = (todayIndex + 6) % 7;

  let yesterdayTimetable = timetable?.[WEEK_DAYS[yesterdayIndex]];
  let todayTimetable = timetable?.[WEEK_DAYS[todayIndex]];

  const [yFirstFrom, yFirstTo, ySecondFrom, ySecondTo] = yesterdayTimetable;

  if (!isEmpty(yesterdayTimetable)) {
    let startDate = moment.utc(yFirstFrom);
    let endDate = moment.utc(yFirstTo);

    if (!isUndefined(ySecondFrom) && !isUndefined(ySecondTo)) {
      startDate = moment.utc(ySecondFrom);
      endDate = moment.utc(ySecondTo);
    }

    const currentDate2Jan = getCurrentUTCDate(1);

    const isOpenYesterday = currentDate2Jan.isSameOrBefore(endDate);

    if (isOpenYesterday) {
      const soonDelta = Math.abs(endDate.diff(currentDate2Jan, "minutes"));
      const content =
        soonDelta <= 30
          ? language.closes_soon
          : language.closes_at + " " + endDate.format("HH:mm");

      return { isOpen: true, content };
    }
  }

  /* Yesterday was closed, check if today is closed */

  const isTodayClosed = isEmpty(todayTimetable);

  if (isTodayClosed) {
    const content = getNextOpenDayContent({ timetable, todayIndex });
    return { isOpen: false, content };
  }

  /* Today is open */

  let [
    firstFromDateString,
    firstToDateString,
    secondFromDateString,
    secondToDateString,
  ] = todayTimetable;

  let currentDate = getCurrentUTCDate();

  let startDate = moment.utc(firstFromDateString);
  let endDate = moment.utc(firstToDateString);

  const startCurrentDateDelta = startDate.diff(currentDate, "minutes");

  if (startCurrentDateDelta > 0) {
    currentDate.add(1, "day");
  }

  let content = "";
  let isOpen = currentDate.isBetween(startDate, endDate);

  const doesSecondSessionExist =
    !isUndefined(secondFromDateString) && !isUndefined(secondToDateString);

  if (isOpen) {
    const soonDelta = Math.abs(endDate.diff(currentDate, "minutes"));
    content =
      soonDelta <= 30
        ? language.closes_soon
        : language.closes_at + " " + endDate.format("HH:mm");
  } else {
    startDate = moment.utc(secondFromDateString);
    endDate = moment.utc(secondToDateString);

    const minutesDelta = startDate.diff(currentDate, "minutes");
    const isSameDay = currentDate.isSame(startDate, "day");

    if (minutesDelta > 0 && !isSameDay) {
      currentDate.add(1, "day");
    }

    isOpen = currentDate.isBetween(startDate, endDate);

    if (isOpen) {
      const closingDate = moment(endDate, DATE_FORMAT);
      const soonDelta = Math.abs(closingDate.diff(currentDate, "minutes"));

      content =
        soonDelta <= 30
          ? language.closes_soon
          : language.closes_at + " " + endDate.format("HH:mm");
    } else {
      if (doesSecondSessionExist && currentDate.isBefore(endDate)) {
        content = `${language.opens_today} ${moment
          .utc(secondFromDateString)
          .format("HH:mm")}`;
      } else {
        content = getNextOpenDayContent({ timetable, todayIndex });
      }
    }
  }

  return { isOpen, content };
};

const formatTimeItem = (date) => {
  return moment(date).utcOffset(0).format("HH:mm");
};

export const formatTimetableItem = (timetable) => {
  let [firstFrom, firstTo] = timetable;

  firstFrom = formatTimeItem(firstFrom);
  firstTo = formatTimeItem(firstTo);

  let [secondFrom, secondTo] = timetable.slice(2, 4);

  if (secondFrom && secondTo) {
    secondFrom = formatTimeItem(secondFrom);
    secondTo = formatTimeItem(secondTo);
  }

  return [firstFrom, firstTo, secondFrom, secondTo];
};

export const formatTimeTableDateTime = (timetable) => {
  const newTimetable = {};

  for (let i = 0; i < WEEK_DAYS.length; i++) {
    const day = WEEK_DAYS[i];
    const dayTimetable = timetable[day];

    const times = dayTimetable.times;
    const isClosed = dayTimetable.isClosed;

    if (isClosed) {
      newTimetable[day] = [];
      continue;
    }

    /* First Section */

    let firstSection = times.slice(0, 2);
    let [firstFromDateString, firstToDateString] = firstSection;

    if (isEmpty(firstFromDateString) || isEmpty(firstToDateString)) {
      newTimetable[day] = [];
      continue;
    }

    [firstFromDateString, firstToDateString] = firstSection.map((time) => {
      return moment(`2023-01-01 ${time}`, DATE_FORMAT).format(DATE_FORMAT);
    });

    let startDate = moment(firstFromDateString, DATE_FORMAT);
    let endDate = moment(firstToDateString, DATE_FORMAT);

    const startEndTimeDelta = startDate.diff(endDate, "minutes");

    if (startEndTimeDelta > 0) {
      endDate.add(1, "day");
    }

    firstFromDateString = formatUTCDate(startDate);
    firstToDateString = formatUTCDate(endDate);

    newTimetable[day] = [firstFromDateString, firstToDateString];

    /* Second Section */

    let secondSection = times.slice(2, 4);
    let [secondFromDateString, secondToDateString] = secondSection;

    if (isEmpty(secondFromDateString) || isEmpty(secondToDateString)) {
      continue;
    }

    [secondFromDateString, secondToDateString] = secondSection.map((time) => {
      return moment(`2023-01-01 ${time}`, DATE_FORMAT).format(DATE_FORMAT);
    });

    startDate = moment(secondFromDateString, DATE_FORMAT);
    endDate = moment(secondToDateString, DATE_FORMAT);

    const startEndTimeDelta2 = startDate.diff(endDate, "minutes");

    if (startEndTimeDelta2 > 0) {
      endDate.add(1, "day");
    }

    secondFromDateString = formatUTCDate(startDate);
    secondToDateString = formatUTCDate(endDate);

    newTimetable[day] = [
      ...newTimetable[day],
      secondFromDateString,
      secondToDateString,
    ];
  }

  return newTimetable;
};

/* Use to convert timetable once downloaded */

export const convertTimetableForBusiness = (timetable) => {
  const newTimetable = {};

  WEEK_DAYS.forEach((day) => {
    const dayTimetable = timetable[day];
    const isClosed = dayTimetable.join("").length === 0;

    const times = dayTimetable.map((time) => {
      if (time === "") {
        return "";
      }

      const dateTimeObj = moment(time, DATE_FORMAT).format(HOUR_FORMAT);

      return dateTimeObj;
    });

    newTimetable[day] = { times, isClosed };
  });

  return newTimetable;
};

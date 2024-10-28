import moment from "moment/min/moment-with-locales";

const getMonths = (fromDate, toDate) => {
  const fromYear = fromDate.getFullYear();
  const fromMonth = fromDate.getMonth();
  const toYear = toDate.getFullYear();
  const toMonth = toDate.getMonth();
  const months = [];

  for (let year = fromYear; year <= toYear; year++) {
    let monthNum = year === fromYear ? fromMonth : 0;
    const monthLimit = year === toYear ? toMonth : 11;

    for (; monthNum <= monthLimit; monthNum++) {
      let month = monthNum + 1;
      months.push({ year, month });
    }
  }
  return months;
};

const getListOfDays = (year, month) => {
  const list = [];
  const date = `${year}-${("0" + month).slice(-2)}`;
  const from = moment(date);
  const to = moment(date).add(1, "months");
  for (let m = moment(from); m.isBefore(to); m.add(1, "days")) {
    list.push(m.format("YYYY-MM-DD"));
  }
  return list;
};

export const generateCalendar = (locale) => {
  let fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 2);
  const toDate = new Date();

  const latest3Months = getMonths(fromDate, toDate);

  let calendar = [];

  moment.locale(locale);

  calendar = latest3Months.map(({ month, year }, index) => {
    const days = getListOfDays(year, month);
    const firstDay = days[0];

    const startDay = moment(firstDay).day();

    const placeholders = [...Array(Math.max(0, startDay - 1)).keys()].map(
      () => {
        return -1;
      }
    );

    return {
      index,
      name: moment().month(month).format("MMMM"),
      days: [...placeholders, ...days],
    };
  });

  return calendar;
};

/*
  1. last 7 days = last-7
  2. last 14 days = last-14
  3. last 30 days = last-30
  4. previous-month = prev-month
  5. last 90 days = last-90
*/

export const CALENDAR_PERIOD_TYPES = {
  last7: "last-7",
  last14: "last-14",
  last30: "last-30",
  prevMonth: "prev-month",
  last80: "last-80",
};

const DATE_FORMAT = "YYYY-MM-DD";

export const getDatesForPeriod = (type) => {
  if (type == CALENDAR_PERIOD_TYPES.prevMonth) {
    const prevMonth = moment().subtract(1, "months");

    const from = prevMonth.startOf("month").format(DATE_FORMAT);
    const to = prevMonth.endOf("month").format(DATE_FORMAT);

    return { from, to };
  }

  let fromDay = 8;

  if (type == CALENDAR_PERIOD_TYPES.last14) {
    fromDay = 15;
  } else if (type == CALENDAR_PERIOD_TYPES.last30) {
    fromDay = 31;
  } else if (type == CALENDAR_PERIOD_TYPES.last80) {
    fromDay = 80;
  }

  const from = moment().subtract(fromDay, "days").format(DATE_FORMAT);
  const to = moment().subtract(1, "days").format(DATE_FORMAT);

  return { from, to };
};

export const formatDateForCalendarDisplay = (from, to) => {
  return {
    from: moment(from).format("MMM DD"),
    to: moment(to).format("MMM DD"),
  };
};

export const getInsightDateInitialValue = (languageContent) => {
  return {
    type: "last-7",
    title: languageContent.last_7_days,
    ...getDatesForPeriod(CALENDAR_PERIOD_TYPES.last7),
  };
};

export const getPreviousPeriod = (from, to) => {
  const fromDate = moment(from);
  const toDate = moment(to);

  const deltaDays = toDate.diff(fromDate, "days");

  const newTo = fromDate.format(DATE_FORMAT);
  const newFrom = fromDate.subtract(deltaDays, "day").format(DATE_FORMAT);

  return { from: newFrom, to: newTo };
};

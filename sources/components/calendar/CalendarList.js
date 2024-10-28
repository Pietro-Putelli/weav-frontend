import { pick } from "lodash";
import moment from "moment";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { Dimensions, ScrollView } from "react-native";
import { useLanguages } from "../../hooks";
import CalendarCell from "./CalendarCell";
import { CALENDAR_PERIOD_TYPES, generateCalendar } from "./utils";

const { height } = Dimensions.get("window");

const CalendarList = ({ data, onChange }) => {
  const markedDays = pick(data, ["from", "to"]);
  const periodType = data.type;

  const scrollRef = useRef();

  const { languageContent } = useLanguages();
  const locale = languageContent.locale;

  const calendarData = useMemo(() => {
    return generateCalendar(locale);
  }, []);

  const yContentOffset = useMemo(() => {
    const { last7, last14, last30, prevMonth, last80 } = CALENDAR_PERIOD_TYPES;

    if ([last7, last14, last30].includes(periodType)) {
      return height;
    }

    if (periodType == prevMonth) {
      return height / 3;
    }

    if (periodType == last80) {
      return 0;
    }
  }, []);

  const onDayPress = useCallback(
    ({ day }) => {
      const { from, to } = markedDays;

      let object = {};

      if (from == null) {
        object = { from: day, to: null };
        return;
      }

      const fromDate = moment(from);
      const toDate = moment(day);

      if (from != null && to != null) {
        object = { from: day, to: null };
      } else if (fromDate.isBefore(toDate)) {
        object = { from, to: day };
      } else {
        object = { from: day, to: null };
      }

      onChange(object);
    },
    [markedDays, onChange]
  );

  return (
    <ScrollView
      contentOffset={{ y: yContentOffset }}
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
    >
      {calendarData.map((month) => {
        return (
          <CalendarCell
            markedDays={markedDays}
            onPress={onDayPress}
            key={month.name}
            month={month}
          />
        );
      })}
    </ScrollView>
  );
};

export default memo(CalendarList);

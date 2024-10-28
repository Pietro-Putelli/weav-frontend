import { isNull, pick } from "lodash";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { IconButton } from "../../components/buttons";
import { CalendarList } from "../../components/calendar";
import { getDatesForPeriod } from "../../components/calendar/utils";
import { DateIntervalSelector } from "../../components/insights";
import { MainText } from "../../components/texts";
import { dateFormats } from "../../dates";
import { formatDate } from "../../dates/formatters";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import FullSheetModal from "../FullSheetModal";

const CalendarModal = ({ onDatePicked, period }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [calendarData, setCalendarData] = useState(period);
  const markedDays = pick(calendarData, ["from", "to"]);

  const isDoneButtonEnabled = useMemo(() => {
    const { from, to } = markedDays;

    const boundsNotNull = !isNull(from) && !isNull(to);

    const fromDate = moment(from);
    const toDate = moment(to);

    const delta = moment.duration(toDate.diff(fromDate)).asDays();

    return delta > 1 && boundsNotNull;
  }, [markedDays]);

  /* Callbacks */

  const onCalendarDatesChanged = useCallback(
    ({ from, to }) => {
      setCalendarData({ from, to });
    },
    [calendarData]
  );

  const onDateIntervalChange = useCallback(
    ({ type, title }) => {
      const newPeriod = getDatesForPeriod(type);
      setCalendarData({ ...newPeriod, type, title });
    },
    [calendarData]
  );

  const onDonePress = useCallback(() => {
    onDatePicked(calendarData);

    navigation.dismissModal();
  }, [calendarData]);

  /* Methods */

  const formatTitle = () => {
    const { from, to } = calendarData;
    if (from == "" && to == "") return "";

    const format = dateFormats.MMM_D;

    const fromFormatted = formatDate({ date: to, format });
    const toFormatted = formatDate({ date: from, format });

    return `${fromFormatted} • ${
      toFormatted == "Invalid date" ? "" : toFormatted
    }`;
  };

  return (
    <FullSheetModal>
      <View
        style={[
          {
            marginBottom: "4%",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: "4%",
          },
          theme.styles.cell,
        ]}
      >
        <MainText capitalize style={{ flex: 1 }} font="title-7" bold>
          {formatTitle()}
        </MainText>

        <IconButton
          haptic
          source={icons.Done}
          onPress={onDonePress}
          side="two"
          inset={2}
          disabled={!isDoneButtonEnabled}
        />
      </View>

      <DateIntervalSelector
        onChange={onDateIntervalChange}
        selectedPeriod={calendarData.type}
      />

      <View style={{ flex: 1, marginBottom: "4%" }}>
        <CalendarList data={calendarData} onChange={onCalendarDatesChanged} />
      </View>
    </FullSheetModal>
  );
};

export default CalendarModal;

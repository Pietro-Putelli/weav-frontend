import { FlashList } from "@shopify/flash-list";
import moment from "moment/min/moment-with-locales";
import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useLanguages } from "../../hooks";
import { MainText } from "../texts";
import DayCell from "./DayCell";

const { width } = Dimensions.get("window");
const CELL_SIDE = (width - 16) / 7;

const CalendarCell = ({ month, markedDays, onPress }) => {
  const { languageContent } = useLanguages();

  const weekdays = useMemo(() => {
    moment.locale(languageContent.locale);

    return moment.weekdays(true);
  }, []);

  const containerStyle = useMemo(() => {
    const rowsCount = Math.ceil(month.days.length / 7);
    return {
      height: (rowsCount + 2) * CELL_SIDE,
    };
  }, []);

  const renderItem = useCallback(
    ({ item: day }) => {
      return (
        <DayCell
          onPress={() => {
            onPress({ monthIndex: month.index, day });
          }}
          markedDays={markedDays}
          day={day}
        />
      );
    },
    [markedDays, onPress]
  );

  return (
    <View style={containerStyle}>
      <View style={styles.month_name_container}>
        <MainText capitalize font="title-6" bold>
          {month.name}
        </MainText>
      </View>

      <View style={styles.days_container}>
        {weekdays.map((day) => {
          return (
            <View key={day} style={styles.cell}>
              <MainText capitalize font="subtitle-1" bold>
                {day.slice(0, 3)}
              </MainText>
            </View>
          );
        })}
      </View>

      <FlashList
        estimatedItemSize={CELL_SIDE}
        numColumns={7}
        keyExtractor={(item, index) => String(index)}
        scrollEnabled={false}
        data={month.days}
        renderItem={renderItem}
        extraData={markedDays}
      />
    </View>
  );
};

export default memo(CalendarCell);

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    justifyContent: "center",
    alignItems: "center",
  },
  days_container: {
    flexDirection: "row",
  },
  month_name_container: {
    alignItems: "center",
    justifyContent: "center",
    height: CELL_SIDE,
  },
  title: {
    fontSize: 30,
  },
});

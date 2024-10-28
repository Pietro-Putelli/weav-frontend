import { isEmpty, isNull } from "lodash";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { MainText } from "../../components/texts";
import { getCurrentDayIndex, getWeekDays } from "../../dates/functions";
import { formatTimetableItem } from "../../dates/timetable";
import { useLanguages, useTheme } from "../../hooks";
import ModalScreen from "../ModalScreen";

const currentDay = getCurrentDayIndex();

const VenueTimetableModal = ({ timetable, isOpen, componentId }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const weekdays = useMemo(() => {
    return getWeekDays();
  }, []);

  const mappedTimetable = useMemo(() => {
    let newTimetable = [];

    const sortedEntries = Object.entries(timetable).sort((a, b) => {
      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      return days.indexOf(a[0]) - days.indexOf(b[0]);
    });

    const sortedObj = Object.fromEntries(sortedEntries);

    for (const [_, times] of Object.entries(sortedObj)) {
      newTimetable.push(times);
    }

    return newTimetable;
  }, []);

  const textProps = {
    font: "subtitle",
    align: "right",
    isNumbers: true,
  };

  const renderItem = useCallback(({ item, index }) => {
    const current = index == Math.max(0, currentDay);

    const containerStyle = current ? { ...theme.styles.shadow_round } : {};

    const isClosed = isEmpty(item) || isEmpty(item.join(""));

    let firstSectionTitle = null;
    let secondSectionTitle = null;

    if (!isClosed) {
      const [firstFrom, firstTo, secondFrom, secondTo] =
        formatTimetableItem(item);

      firstSectionTitle = `${firstFrom} - ${firstTo}`;

      if (secondFrom && secondTo) {
        secondSectionTitle = `${secondFrom} - ${secondTo}`;
      }
    }

    return (
      <View style={[styles.cell, containerStyle]}>
        <MainText
          align="left"
          font="subtitle"
          style={[
            {
              flex: 1,
              textTransform: "capitalize",
              color: current
                ? isOpen
                  ? theme.colors.green
                  : theme.colors.red
                : "white",
            },
          ]}
        >
          {weekdays[index]}
        </MainText>

        <View>
          {isClosed ? (
            <MainText
              font="subtitle"
              color={theme.colors.red}
              capitalize
              align="center"
            >
              {languageContent.closed}
            </MainText>
          ) : (
            <>
              {!isNull(firstSectionTitle) && (
                <MainText {...textProps}>{firstSectionTitle}</MainText>
              )}
              {!isNull(secondSectionTitle) && (
                <MainText {...textProps} style={{ marginTop: "3%" }}>
                  {secondSectionTitle}
                </MainText>
              )}
            </>
          )}
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  return (
    <ModalScreen componentId={componentId} cursor>
      <FlatList
        data={mappedTimetable}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </ModalScreen>
  );
};
export default VenueTimetableModal;

const styles = StyleSheet.create({
  cell: {
    padding: "3%",
    alignItems: "center",
    flexDirection: "row",
  },
});

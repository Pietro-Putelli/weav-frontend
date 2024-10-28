import { findIndex } from "lodash";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { dateFormats } from "../../dates";
import { formatDate } from "../../dates/formatters";
import { getNext30Days, getWeekDays } from "../../dates/functions";
import { useLanguages } from "../../hooks";
import DateCell from "./DateCell";
import HairlineSelector from "./HairlineSelector";
import PickerList from "./PickerList";
import { VIEWPORT_HEIGHT } from "./constants";

const DatePicker = ({ value: date, isPeriodic, onValueChanged }) => {
  const scrollY = useSharedValue(0);
  const listRef = useRef();

  const { languageContent } = useLanguages();

  useEffect(() => {
    if (!date) {
      onValueChanged(dates[0]);
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollToIndex({ index: 0 });
  }, [isPeriodic]);

  const dates = useMemo(() => {
    if (isPeriodic) {
      return getWeekDays();
    }

    return getNext30Days();
  }, [isPeriodic]);

  const initialScrollIndex = useMemo(() => {
    const index = findIndex(dates, (d) => {
      return date == d;
    });

    return Math.max(0, index);
  }, [date]);

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <DateCell
          isPeriodic={isPeriodic}
          scrollY={scrollY}
          index={index}
          text={item}
        />
      );
    },
    [isPeriodic]
  );

  const keyExtractor = useCallback((item) => {
    return item;
  }, []);

  return (
    <View style={styles.container}>
      <HairlineSelector />

      <PickerList
        data={dates}
        ref={listRef}
        scrollY={scrollY}
        initialScrollIndex={initialScrollIndex}
        renderItem={renderItem}
        onChangeIndex={(index) => {
          onValueChanged(dates[index]);
        }}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default memo(DatePicker);

const styles = StyleSheet.create({
  container: {
    height: VIEWPORT_HEIGHT,
  },
});

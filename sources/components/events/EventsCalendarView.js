import React, { memo, useCallback, useMemo, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { dateFormats } from "../../dates";
import { formatDate } from "../../dates/formatters";
import { useTheme } from "../../hooks";
import { typographies } from "../../styles";
import { AdvancedFlatList } from "../lists";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");
const CELL_SIDE = Math.round(width / 5);
const CALENDAR_HEIGHT = CELL_SIDE * 1.4;
const PADDING = Math.round(width / 2) - Math.round(CELL_SIDE / 2);
const DOT_SIDE = 5;

const EventsCalendarView = ({ scrollX, dates, onPress, ...props }) => {
  const carouselfRef = useRef();

  /* Callbacks */

  const onDatePress = useCallback(({ index }) => {
    if (carouselfRef.current) {
      carouselfRef.current.scrollToOffset({
        offset: CELL_SIDE * index,
        animated: true,
      });
    }

    onPress(index);
  }, []);

  /* Components */

  const renderItem = useCallback(({ item, index }) => {
    return (
      <EventCalendarCell
        item={item}
        index={index}
        scrollX={scrollX}
        onPress={onDatePress}
      />
    );
  }, []);

  return (
    <View style={styles.container}>
      <AdvancedFlatList
        horizontal
        data={dates}
        scrollX={scrollX}
        ref={carouselfRef}
        itemSize={CELL_SIDE}
        renderItem={renderItem}
        snapToAlignment="center"
        decelerationRate={"fast"}
        contentContainerStyle={styles.contentContainerStyle}
        {...props}
      />
    </View>
  );
};

export default memo(EventsCalendarView);

const EventCalendarCell = memo(({ item, index, scrollX, onPress }) => {
  const theme = useTheme();

  const cellContentStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.cellContent,
    };
  }, []);

  const { dayName, dayNumber, monthName } = useMemo(() => {
    const date = item.date;

    const dayName = formatDate({ date, format: dateFormats.ddd });
    const dayNumber = formatDate({ date, format: dateFormats.DD });
    const monthName = formatDate({ date, format: dateFormats.MMM });

    return { dayName, dayNumber, monthName };
  }, [item]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * CELL_SIDE,
      (index - 1) * CELL_SIDE,
      index * CELL_SIDE,
      (index + 1) * CELL_SIDE,
      (index + 2) * CELL_SIDE,
    ];

    const scaleOutputRange = [0.7, 0.9, 1.3, 0.9, 0.7];
    const translateXOutputRange = [6, 14, 0, -14, -6];
    const opacityOutputRange = [0.4, 0.8, 1, 0.8, 0.4];

    const scrollXValue = scrollX.value;
    const extrapolateClamp = Extrapolate.CLAMP;

    return {
      transform: [
        {
          scale: interpolate(
            scrollXValue,
            inputRange,
            scaleOutputRange,
            extrapolateClamp
          ),
        },
        {
          translateX: interpolate(
            scrollXValue,
            inputRange,
            translateXOutputRange,
            extrapolateClamp
          ),
        },
      ],
      opacity: interpolate(
        scrollXValue,
        inputRange,
        opacityOutputRange,
        extrapolateClamp
      ),
    };
  });

  const dotStyle = useMemo(() => {
    return [{ backgroundColor: theme.colors.main_accent }, styles.dot];
  }, []);

  return (
    <BounceView
      onPress={() => {
        onPress({ date: item.date, index });
      }}
      style={styles.cellContainer}
    >
      <Animated.View style={[cellContentStyle, contentAnimatedStyle]}>
        <MainText capitalize font="subtitle-4">
          {dayName}
        </MainText>

        <MainText style={styles.dayNumber} isNumbers>
          {dayNumber}
        </MainText>

        <MainText capitalize font="subtitle-4">
          {monthName}
        </MainText>

        {item?.hasEvents && <View style={dotStyle} />}
      </Animated.View>
    </BounceView>
  );
});

const styles = StyleSheet.create({
  cellContainer: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    justifyContent: "center",
  },
  cellContent: {
    flex: 1,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainerStyle: {
    paddingTop: CELL_SIDE * 0.25,
    paddingHorizontal: PADDING,
  },
  dayNumber: {
    fontSize: typographies.fontSizes.title8,
    fontWeight: "bold",
  },
  container: {
    height: CALENDAR_HEIGHT,
    marginTop: "-2%",
  },
  dot: {
    marginTop: 4,
    width: DOT_SIDE,
    height: DOT_SIDE,
    borderRadius: DOT_SIDE / 2,
  },
});

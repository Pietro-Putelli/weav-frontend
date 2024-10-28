import { findIndex } from "lodash";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { CELL_HEIGHT, VIEWPORT_HEIGHT } from "./constants";
import HairlineSelector from "./HairlineSelector";
import PickerList from "./PickerList";
import TimetableCell from "./TimetableCell";

const { width } = Dimensions.get("window");

const CAROUSEL_WIDTH = width - 12;
const LIST_WIDTH = CAROUSEL_WIDTH / 4;

const TimePicker = ({ value, onValueChanged }) => {
  const { time, ampm } = useMemo(() => {
    if (value) {
      const [time, ampm] = value?.split(" ");
      return { time, ampm };
    }
    return { time: "", ampm: "" };
  }, []);

  const hourScrollY = useSharedValue(0);
  const minuteScrollY = useSharedValue(0);
  const ampmScrollY = useSharedValue(0);

  const is24HourFormat = true; // !is12HourFormat();

  useEffect(() => {
    if (!value) {
      onValueChanged(defaultTime);
    }
  }, []);

  const addLeadingZero = (value) => {
    if (value < 10) {
      return "0" + String(value);
    }

    return String(value);
  };

  const hours = useMemo(() => {
    if (is24HourFormat) {
      return Array.from(Array(24).keys()).map(addLeadingZero);
    }

    return Array.from(Array(13).keys()).slice(1, 13).map(addLeadingZero);
  }, []);

  const minutes = useMemo(() => {
    return Array.from(Array(11).keys()).map((value) => {
      if (value == 0 || value == 1) {
        return "0" + String(value * 5);
      }
      return String(value * 5);
    });
  }, []);

  const ampmValues = useMemo(() => {
    return ["AM", "PM"];
  }, []);

  const defaultTime = useMemo(() => {
    if (is24HourFormat) {
      return `${hours[0]}:${minutes[0]}`;
    }
    return `${hours[0]}:${minutes[0]} ${ampmValues[0]}`;
  }, []);

  /* { hour , minute , ampm } */
  const {
    initialHourIndex,
    initialMinuteIndex,
    initialAmPmIndex,
    hour,
    minute,
  } = useMemo(() => {
    const slices = time?.split(":");

    const hour = slices?.[0] ?? "0";
    let minute = slices?.[1] ?? "0";

    if (minute == 60) {
      minute = "00";
    }

    const initialHourIndex = Math.max(
      findIndex(hours, (h) => {
        return h == hour;
      }),
      0
    );

    const initialMinuteIndex = Math.max(
      findIndex(minutes, (m) => {
        return m == minute;
      }),
      0
    );

    return {
      hour,
      minute,

      initialHourIndex,
      initialMinuteIndex,
      initialAmPmIndex: String(ampm).toLowerCase() == "pm" ? 1 : 0,
    };
  }, []);

  /* States */

  const [result, setResult] = useState({ hour, minute, ampm });

  /* Callbacks */

  const onChangeIndex = useCallback(
    ({ index, key }) => {
      let newTime = {};

      if (key == "hour") {
        newTime.hour = hours[index];
      } else if (key == "minute") {
        newTime.minute = minutes[index];
      } else {
        newTime.ampm = index == 0 ? "am" : "pm";
      }

      const newResult = { ...result, ...newTime };
      setResult(newResult);

      const { hour, minute } = newResult;

      // removed am pm from date
      let formattedTime = `${hour}:${minute}`;

      onValueChanged(formattedTime);
    },
    [result, hours, minutes]
  );

  const renderHourItem = useCallback(({ item, index }) => {
    return <TimetableCell scrollY={hourScrollY} index={index} text={item} />;
  }, []);

  const renderMinuteItem = useCallback(({ item, index }) => {
    return <TimetableCell scrollY={minuteScrollY} index={index} text={item} />;
  }, []);

  const renderAmPmItem = useCallback(({ item, index }) => {
    return <TimetableCell scrollY={ampmScrollY} index={index} text={item} />;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HairlineSelector />

        <View style={styles.list_container}>
          <PickerList
            initialScrollIndex={initialHourIndex}
            renderItem={renderHourItem}
            scrollY={hourScrollY}
            data={hours}
            onChangeIndex={(index) => {
              onChangeIndex({ index, key: "hour" });
            }}
          />
        </View>

        <View style={styles.list_container}>
          <PickerList
            initialScrollIndex={initialMinuteIndex}
            scrollY={minuteScrollY}
            data={minutes}
            renderItem={renderMinuteItem}
            onChangeIndex={(index) => {
              onChangeIndex({ index, key: "minute" });
            }}
          />
        </View>

        {!is24HourFormat && (
          <View style={styles.list_container}>
            <PickerList
              data={ampmValues}
              scrollY={ampmScrollY}
              initialScrollIndex={initialAmPmIndex}
              renderItem={renderAmPmItem}
              onChangeIndex={(index) => {
                onChangeIndex({ index, key: "ampm" });
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(TimePicker);

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    width: CAROUSEL_WIDTH,
    height: VIEWPORT_HEIGHT,
    justifyContent: "center",
  },
  hairline: {
    width: "80%",
    position: "absolute",
    top: CELL_HEIGHT,
    zIndex: 10,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  contentContainerStyle: {
    paddingTop: CELL_HEIGHT,
    paddingBottom: CELL_HEIGHT,
  },
  list_container: {
    width: LIST_WIDTH,
  },
});

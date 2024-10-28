import { findIndex } from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useLanguages } from "../../hooks";
import { MainText } from "../texts";
import BaseCell from "./BaseCell";
import HairlineSelector from "./HairlineSelector";
import PickerList from "./PickerList";
import { VIEWPORT_HEIGHT } from "./constants";

const DurationPicker = ({ value, onValueChanged }) => {
  const scrollY = useSharedValue(0);

  const { languageContent } = useLanguages();

  const durations = useMemo(() => {
    const { hour, hours, day } = languageContent;

    return [
      { title: "30 min", value: 30 },
      { title: "1 " + hour, value: 60 },
      { title: "2 " + hours, value: 120 },
      { title: "3 " + hours, value: 180 },
      { title: "4 " + hours, value: 240 },
      { title: "8 " + hours, value: 480 },
      { title: "12 " + hours, value: 720 },
      { title: "1 " + day, value: 1440 },
    ];
  }, []);

  const initialScrollIndex = useMemo(() => {
    const index = findIndex(durations, ["value", value]);

    return Math.max(0, index);
  }, [value]);

  const renderItem = useCallback(({ item, index }) => {
    return (
      <BaseCell scrollY={scrollY} index={index} text={item}>
        <MainText bold font="title-7">
          {item.title}
        </MainText>
      </BaseCell>
    );
  }, []);

  const keyExtractor = (item) => {
    return item.title;
  };

  return (
    <View style={{ height: VIEWPORT_HEIGHT }}>
      <HairlineSelector />

      <PickerList
        scrollY={scrollY}
        data={durations}
        initialScrollIndex={initialScrollIndex}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onChangeIndex={(index) => {
          onValueChanged(durations[index].value);
        }}
      />
    </View>
  );
};

export default memo(DurationPicker);

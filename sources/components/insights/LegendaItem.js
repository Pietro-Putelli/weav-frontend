import React, { memo } from "react";
import { View } from "react-native";
import { MainText } from "../texts";

const COLOR_SIDE = 10;

const LegendaItem = ({ title, color }) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
    >
      <View
        style={{
          width: COLOR_SIDE,
          height: COLOR_SIDE,
          backgroundColor: color,
          borderRadius: 30,
          marginRight: 8,
        }}
      />
      <MainText font="subtitle-2">{title}</MainText>
    </View>
  );
};

export default memo(LegendaItem);

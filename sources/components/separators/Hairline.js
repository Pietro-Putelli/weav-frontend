import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { widthPercentage } from "../../styles/sizes";

const Hairline = ({ style, width = 0.8 }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        width: widthPercentage(width),
        alignSelf: "center",
        backgroundColor: theme.white_alpha(0.15),
        marginVertical: 8,
        ...style,
      }}
    />
  );
};

export default memo(Hairline);

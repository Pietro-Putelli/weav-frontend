import React, { memo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";

const PurpleDot = ({ side = 8, style }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        width: side,
        height: side,
        backgroundColor: theme.colors.main_accent,
        borderRadius: side / 2,
        ...style,
      }}
    />
  );
};

export default memo(PurpleDot);

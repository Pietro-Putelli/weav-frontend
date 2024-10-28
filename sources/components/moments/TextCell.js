import React, { memo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import ContentView from "./ContentView";

const TextCell = ({ onLayout, ...props }) => {
  const theme = useTheme();

  return (
    <View onLayout={onLayout} style={theme.styles.shadow_round}>
      <ContentView {...props} />
    </View>
  );
};

export default memo(TextCell);

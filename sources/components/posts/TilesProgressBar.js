import React, { memo } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks";

const TilesProgressBar = ({ current, count }) => {
  if (count == 1) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", marginBottom: "2%" }}>
      {[...Array(count).keys()].map((index) => {
        return <Tile key={index} index={index} current={current} />;
      })}
    </View>
  );
};
export default memo(TilesProgressBar);

const Tile = memo(({ current, index }) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        height: 2.5,
        flexDirection: "row",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: 2,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: theme.colors.main_accent,
            flex: current < index ? 0 : 1,
          },
        ]}
      />
    </View>
  );
});

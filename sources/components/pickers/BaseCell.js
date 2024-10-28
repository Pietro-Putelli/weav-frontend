import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { CELL_HEIGHT } from "./constants";

const BaseCell = ({ index, scrollY, style, children }) => {
  const inputRange = useMemo(() => {
    return [
      (index - 1) * CELL_HEIGHT,
      index * CELL_HEIGHT,
      (index + 1) * CELL_HEIGHT,
    ];
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            inputRange,
            [0.6, 1, 0.6],
            Extrapolate.CLAMP
          ),
        },
        {
          rotateX: `${interpolate(
            scrollY.value,
            inputRange,
            [30, 0, -30],
            Extrapolate.CLAMP
          )}deg`,
        },
        {
          perspective: 200,
        },
      ],
      opacity: interpolate(
        scrollY.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <Animated.View style={[styles.cell, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default memo(BaseCell);

const styles = StyleSheet.create({
  cell: {
    justifyContent: "center",
    alignItems: "center",
    height: CELL_HEIGHT,
  },
});

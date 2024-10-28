import React, { memo } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedBackgroundColorView = ({ isActive, style, colors, ...props }) => {
  const progress = useDerivedValue(() => {
    return isActive ? withTiming(1) : withTiming(0);
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    if (colors?.length == 1) {
      return { backgroundColor: colors[0] };
    }

    const backgroundColor = interpolateColor(progress.value, [0, 1], colors);
    return { backgroundColor };
  });

  return (
    <Animated.View style={[style, animatedStyle]} {...props}></Animated.View>
  );
};

export default memo(AnimatedBackgroundColorView);

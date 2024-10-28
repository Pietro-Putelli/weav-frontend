import React, { useEffect } from "react";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const CollapseView = ({ style, height, collapsed, allowY, children }) => {
  const heightAnimation = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const value = collapsed ? 0 : height;

    heightAnimation.value = withTiming(value, { duration: 400 });

    if (allowY) {
      const yValue = collapsed ? 200 : 0;
      translateY.value = withSpring(yValue, { damping: 14 });
    }
  });

  const containerAnimationStyle = useAnimatedStyle(() => {
    return {
      height: heightAnimation.value,
      transform: [{ translateY: allowY ? translateY.value : 0 }],
    };
  });

  return (
    <Animated.View
      style={[{ width: "100%", ...style }, containerAnimationStyle]}
    >
      {children}
    </Animated.View>
  );
};
export default CollapseView;

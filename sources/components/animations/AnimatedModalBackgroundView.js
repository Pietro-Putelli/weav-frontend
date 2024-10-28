import React, { memo, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { DismissPostGesture } from "../gestures";

const AnimatedModalBackgroundView = ({ children, ...props }) => {
  const alpha = useSharedValue(0);

  useEffect(() => {
    alpha.value = withDelay(100, withTiming(0.98, { duration: 400 }));
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      backgroundColor: `rgba(9, 6, 22,${alpha.value})`,
    };
  });

  return (
    <DismissPostGesture>
      <Animated.View style={containerAnimatedStyle} {...props}>
        {children}
      </Animated.View>
    </DismissPostGesture>
  );
};

export default memo(AnimatedModalBackgroundView);

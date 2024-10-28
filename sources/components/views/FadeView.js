import React, { memo, useEffect, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const FadeView = ({
  style,
  hidden,
  delay = 0,
  duration = 300,
  removeWhenHide,
  children,
}) => {
  const opacity = useSharedValue(0);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(hidden ? 0 : 1, { duration }, (finished) => {
        if (finished) runOnJS(setVisible)(!hidden);
      })
    );
  }, [hidden]);

  useEffect(() => {
    if (visible && removeWhenHide) {
      opacity.value = withDelay(delay, withTiming(1, { duration }));
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {removeWhenHide ? visible && children : children}
    </Animated.View>
  );
};
export default memo(FadeView);

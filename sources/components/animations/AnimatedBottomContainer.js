import React, { memo, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { RFPercentage } from "react-native-responsive-fontsize";

const HIDE_Y = RFPercentage(20);

const AnimatedBottomContainer = ({ children, style, isVisible, ...props }) => {
  const translateY = useSharedValue(HIDE_Y);

  useEffect(() => {
    const value = isVisible ? 0 : HIDE_Y;
    translateY.value = withDelay(200, withTiming(value, { duration: 500 }));
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  }, []);

  return (
    <Animated.View style={[style, animatedStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

export default memo(AnimatedBottomContainer);

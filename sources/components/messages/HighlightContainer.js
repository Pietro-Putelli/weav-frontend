import React, { memo, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const HighlightContainer = ({ highlight, ...props }) => {
  if (!highlight) {
    return <ContentMessage {...props} />;
  }

  const translateX = useSharedValue(1);

  useEffect(() => {
    translateX.value = withTiming(50, { duration: 400 }, (finished) => {
      translateX.value = withTiming(0, { damping: 200 });
    });
  }, [highlight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <ContentMessage {...props} />
    </Animated.View>
  );
};

export default memo(HighlightContainer);

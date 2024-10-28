import React, { forwardRef, memo, useImperativeHandle, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const CameraFlareView = forwardRef((props, ref) => {
  const opacity = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    flare: () => {
      opacity.value = withTiming(1, { duration: 150 }, (finished) => {
        if (finished) {
          opacity.value = 0;
        }
      });
    },
  }));

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const containerStyle = useMemo(() => {
    return [
      {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "black",
        zIndex: 2,
      },
      animatedContainerStyle,
    ];
  }, []);

  return <Animated.View style={containerStyle} {...props} />;
});

export default memo(CameraFlareView);

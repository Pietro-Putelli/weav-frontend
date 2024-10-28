import React, { memo, useEffect, useState } from "react";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { StyleSheet } from "react-native";

const Modal = ({ visible, children }) => {
  const opacity = useSharedValue(0);

  const [hidden, setHidden] = useState(!visible);

  useEffect(() => {
    if (!visible) {
      opacity.value = withTiming(0, null, (finished) => {
        if (finished) {
          runOnJS(setHidden)(true);
        }
      });
    } else {
      setHidden(false);
      opacity.value = withTiming(1);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (hidden) {
    return null;
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default memo(Modal);

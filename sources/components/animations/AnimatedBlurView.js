import { BlurView } from "expo-blur";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const _AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const AnimatedBlurView = ({
  visible,
  style,
  children,
  intensity = 80,
  animationDuration = 150,
}) => {
  const _intensity = useDerivedValue(() => {
    return withTiming(visible ? intensity : 0, { duration: animationDuration });
  }, [visible]);

  const animatedProps = useAnimatedProps(() => {
    return {
      intensity: _intensity.value,
    };
  }, [_intensity, visible]);

  return (
    <_AnimatedBlurView
      animatedProps={animatedProps}
      tint="dark"
      style={[styles.container, style]}
    >
      {children}
    </_AnimatedBlurView>
  );
};

export default memo(AnimatedBlurView);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
});

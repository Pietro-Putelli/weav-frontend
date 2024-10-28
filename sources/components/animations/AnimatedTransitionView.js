import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { BORDER_RADIUS } from "../../styles/sizes";

const { width } = Dimensions.get("window");

const AnimatedTransitionView = ({
  direction,
  isVisible,
  children,
  style,
  onPresented,
  ...props
}) => {
  const theme = useTheme();

  const translateX = useDerivedValue(() => {
    return withSpring(
      isVisible ? 0 : width,
      { mass: 0.5, damping: 12 },
      (isFinished) => {
        if (isFinished && !isVisible && onPresented) {
          runOnJS(onPresented)();
        }
      }
    );
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: (direction == "left" ? -1 : 1) * translateX.value },
        { translateY: translateX.value / 3 },
      ],
      borderRadius: BORDER_RADIUS,
      backgroundColor: theme.colors.second_background,
    };
  });

  return (
    <Animated.View style={[style, animatedContainerStyle]} {...props}>
      {children}
    </Animated.View>
  );
};

export default AnimatedTransitionView;

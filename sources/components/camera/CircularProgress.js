import React, { useEffect } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const CIRCLE_LENGTH = 1000;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const { cx, cy } = { cx: width / 2, cy: height / 2 };

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 200 });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  return (
    <Svg>
      <Circle cx={cx} cy={cy} r={R} strokeWidth={16} stroke="#202020" />
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={R}
        strokeWidth={16}
        stroke="darkblue"
        strokeDasharray={CIRCLE_LENGTH}
        strokeLinecap="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
};
export default CircularProgress;

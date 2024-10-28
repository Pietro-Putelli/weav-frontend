import React, { memo, useMemo } from "react";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";

const DAMPING = 18;

const TranslateAnimatedView = ({ mode, children, ...props }) => {
  const options = useMemo(() => {
    if (mode == "right") {
      return {
        entering: SlideInRight.damping(DAMPING).springify(),
        exiting: SlideOutLeft.damping(DAMPING).springify(),
      };
    }
    return {
      entering: SlideInLeft.damping(DAMPING).springify(),
      exiting: SlideOutRight.damping(DAMPING).springify(),
    };
  }, []);

  return (
    <Animated.View {...options} {...props}>
      {children}
    </Animated.View>
  );
};

export default memo(TranslateAnimatedView);

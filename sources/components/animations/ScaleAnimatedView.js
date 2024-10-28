import React, { memo, useMemo } from "react";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

const ScaleAnimatedView = ({
  children,
  disabled,
  disableEntering,
  disabledExiting,
  delay = 0,
  ...props
}) => {
  const animationProps = useMemo(() => {
    if (disabled) {
      return {};
    }

    return {
      entering: disableEntering ? null : ZoomIn.delay(delay),
      exiting: disabledExiting ? null : ZoomOut,
    };
  }, [disabled]);

  return (
    <Animated.View {...animationProps} {...props}>
      {children}
    </Animated.View>
  );
};

export default memo(ScaleAnimatedView);

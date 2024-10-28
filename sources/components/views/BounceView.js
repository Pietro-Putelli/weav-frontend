import React, { memo, useCallback, useRef } from "react";
import { TouchableWithoutFeedback } from "react-native";
import Animated from "react-native-reanimated";
import { triggerHapticOnce } from "../../utility/haptics";
import TouchableScale from "../gestures/TouchableScale";

const DEFAULT_ACTIVE_SCALE = 0.98;

const BounceView = ({
  style: propStyle,
  children,
  onPress,
  haptic,
  disabled,
  activeScale,
  onLongPress,
  disabledWithoutOpacity,
  disabledLongPress,
}) => {
  const isTouched = useRef(false);

  const _onLongPress = useCallback(() => {
    if (!disabledLongPress) {
      onLongPress?.();
    }
  }, [disabledLongPress, onLongPress]);

  const _onPress = useCallback(() => {
    if (haptic) {
      triggerHapticOnce();
    }

    if (!isTouched.current) {
      isTouched.current = true;
      setTimeout(() => {
        isTouched.current = false;
      }, 300);

      onPress?.();
    }
  }, [haptic, onPress]);

  return (
    <TouchableScale
      tension={0}
      style={propStyle}
      onPress={_onPress}
      delayLongPress={300}
      onLongPress={_onLongPress}
      disabled={disabled || disabledWithoutOpacity}
      disabledWithoutOpacity={disabledWithoutOpacity}
      activeScale={activeScale ?? DEFAULT_ACTIVE_SCALE}
    >
      {children}
    </TouchableScale>
  );
};

export default memo(BounceView);

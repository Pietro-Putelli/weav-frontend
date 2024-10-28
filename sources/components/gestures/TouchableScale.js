import React, { memo, useEffect, useRef } from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";

const TouchableScale = ({
  defaultScale = 1,
  activeScale = 0.9,
  tension = 150,
  friction = 3,
  disabled,
  disabledWithoutOpacity,
  ...props
}) => {
  const scaleAnimation = useRef(new Animated.Value(defaultScale)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!disabledWithoutOpacity) {
      Animated.timing(opacityAnimation, {
        toValue: disabled ? 0.6 : 1,
        useNativeDriver: true,
      }).start();
    }
  }, [disabled, disabledWithoutOpacity]);

  const onPressIn = (...args) => {
    Animated.spring(scaleAnimation, {
      toValue: activeScale,
      tension: tension,
      friction: friction,
      useNativeDriver: true,
    }).start();

    if (props.onPressIn) {
      props.onPressIn(...args);
    }
  };

  const onPressOut = (...args) => {
    Animated.spring(scaleAnimation, {
      toValue: defaultScale,
      tension: tension,
      friction: friction,
      useNativeDriver: 1,
    }).start();

    if (props.onPressOut) {
      props.onPressOut(...args);
    }
  };

  return (
    <TouchableWithoutFeedback
      {...props}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          props.style,
          {
            transform: [{ scale: scaleAnimation }],
            opacity: opacityAnimation,
          },
        ]}
      >
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default memo(TouchableScale);

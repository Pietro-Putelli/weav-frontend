import { isUndefined } from "lodash";
import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { icons } from "../../styles";
import { ICON_SIZES, widthPercentage } from "../../styles/sizes";
import { triggerHaptic } from "../../utility/haptics";
import { SquareImage } from "../images";

const X_LIMIT = widthPercentage(0.3);
const { width } = Dimensions.get("window");
const MAX_ICON_SIDE = ICON_SIZES.one;
const MAX_X_SWIPE = width / 6;

const SwipeableContainer = ({
  onSwipeLeft,
  onSwipeRight,
  style,
  leftIcon,
  rightIcon,
  disabled,
  renderSignfier,
  children,
  activeOffsetX = [-10, 10],
}) => {
  const translateX = useSharedValue(0);
  const halfTriggered = useSharedValue(false);

  const _onSwiped = (isLeft) => {
    triggerHaptic();

    if (isLeft) {
      onSwipeLeft();
    } else {
      onSwipeRight();
    }
  };

  const isSwipeLeftAllowed = !isUndefined(onSwipeLeft);
  const isSwipeRightAllowed = !isUndefined(onSwipeRight);

  const panGesture = Gesture.Pan()
    .onChange(({ translationX }) => {
      if (translationX > 0 && !isSwipeRightAllowed) {
        return;
      }

      translateX.value = translationX / 2;

      if (!halfTriggered.value) {
        if (translationX <= -X_LIMIT && isSwipeLeftAllowed) {
          halfTriggered.value = true;

          runOnJS(_onSwiped)(true);
        }

        if (translationX >= X_LIMIT && isSwipeRightAllowed) {
          halfTriggered.value = true;

          runOnJS(_onSwiped)(false);
        }
      }
    })
    .onEnd(() => {
      halfTriggered.value = false;
      translateX.value = withSpring(0, { damping: 14 });
    })
    .activeOffsetX(activeOffsetX)
    .maxPointers(1)
    .enabled(!disabled);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  }, []);

  const animatedLeftIconStyle = useAnimatedStyle(() => {
    const inputRange = [0, MAX_X_SWIPE];

    const scale = interpolate(
      translateX.value,
      inputRange,
      [0, 1],
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      translateX.value,
      inputRange,
      [60, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
      zIndex: -1,
      position: "absolute",
      left: 16,
    };
  });

  const animatedRightIconStyle = useAnimatedStyle(() => {
    const inputRange = [-MAX_X_SWIPE, 0];

    const scale = interpolate(
      translateX.value,
      inputRange,
      [1, 0],
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      translateX.value,
      inputRange,
      [0, 60],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
      zIndex: -1,
      position: "absolute",
      right: 16,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>

        <Animated.View style={animatedRightIconStyle}>
          {!isUndefined(renderSignfier) ? (
            renderSignfier()
          ) : (
            <SquareImage
              side={MAX_ICON_SIDE}
              source={rightIcon ?? icons.Reply}
            />
          )}
        </Animated.View>

        <Animated.View style={animatedLeftIconStyle}>
          {!isUndefined(renderSignfier) ? (
            renderSignfier()
          ) : (
            <SquareImage side={MAX_ICON_SIDE} source={leftIcon} />
          )}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default memo(SwipeableContainer);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});

import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const X_LIMIT = width / 3;

const OptionsSwipeableView = ({
  translateX,
  renderOptions,
  enabled,
  onSwipe,
  children,
  ...props
}) => {
  const context = useSharedValue({ startX: 0, trigger: false });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value.startX = translateX.value;
    })
    .onChange(({ translationX, velocityX }) => {
      if (velocityX < 0) {
        context.trigger = true;
      }

      if (velocityX > 0 && !context.value.trigger) {
        return;
      }

      translateX.value = translationX + context.value.startX;
    })
    .onEnd(({ velocityX }) => {
      if (velocityX < 0) {
        translateX.value = withSpring(-X_LIMIT, { damping: 14 });
        onSwipe && runOnJS(onSwipe)("half");
      }

      if (velocityX > 0) {
        translateX.value = withSpring(0, { damping: 14 });
        onSwipe && runOnJS(onSwipe)("end");
        context.value.trigger = false;
      }
    })
    .activeOffsetX([-10, 10])
    .enabled(enabled);

  return (
    <>
      <View style={styles.options_container}>{renderOptions?.()}</View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedContainerStyle]} {...props}>
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
};
export default OptionsSwipeableView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  options_container: {
    marginRight: "2%",
    alignItems: "flex-end",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
});

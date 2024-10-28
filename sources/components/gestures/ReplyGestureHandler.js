import React, { memo } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const X_LIMIT = width / 3;

const ReplyGestureHandler = ({
  translateX,
  children,
  isSender,
  style,
  onReply,
  disabled,
}) => {
  const hapticTriggered = useSharedValue(false);

  const _onReply = () => {
    // triggerHapticOnce();
    // onReply?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onChange(({ translationX, velocityX }) => {
      if (velocityX <= 0) {
        // SENDER MESSAGE REPLY <== (-)

        translateX.value = translationX / 2;

        if (
          !hapticTriggered.value &&
          translationX <= -X_LIMIT &&
          isSender &&
          !disabled
        ) {
          hapticTriggered.value = true;
          runOnJS(_onReply)();
        }
      } else {
        translateX.value = translationX / 2;

        if (
          !hapticTriggered.value &&
          translationX >= X_LIMIT &&
          !isSender &&
          !disabled
        ) {
          hapticTriggered.value = true;
          runOnJS(_onReply)();
        }
      }
    })
    .onEnd(() => {
      hapticTriggered.value = false;
      translateX.value = withSpring(0, { damping: 14 });
    })
    .activeOffsetX([-10, 10]);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </GestureDetector>
  );
};
export default memo(ReplyGestureHandler);

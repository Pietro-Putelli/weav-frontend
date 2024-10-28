import React, { useEffect, useState } from "react";
import { Dimensions, Modal, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

const DAMPING = 16;
const TRANSLATE_DURATION = 200;
const INITIAL_VALUE = height;

const PopupModal = ({
  visible,
  setVisible,
  disabledGesture,
  onDismiss,
  children,
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const translateY = useSharedValue(INITIAL_VALUE);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      translateY.value = withSpring(0, { damping: DAMPING });
    }
    if (visible == false) goBack();
  }, [visible]);

  const goBack = () => {
    setTimeout(() => {
      setModalVisible(false);
    }, TRANSLATE_DURATION);

    onDismiss?.();

    translateY.value = withTiming(
      INITIAL_VALUE,
      { duration: TRANSLATE_DURATION },
      (finished) => {
        if (finished && setVisible) runOnJS(setVisible)(false);
      }
    );
  };

  const animatedContent = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onChange(({ translationY }) => {
      translateY.value = translationY;
    })
    .onEnd(({ translationY }) => {
      if (translationY > INITIAL_VALUE / 6) runOnJS(goBack)();
      else translateY.value = withSpring(0, { damping: DAMPING });
    })
    .enabled(!disabledGesture);

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00000080",
        }}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedContent}>{children}</Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};
export default PopupModal;

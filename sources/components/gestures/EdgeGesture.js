import React, { memo } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Navigation } from "react-native-navigation";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { runOnJS } from "react-native-reanimated";
import { useLanguages } from "../../hooks";
import { DoubleOptionPopupModal } from "../../modals";
import { EdgeBackGestureView } from "../views";

const EdgeGesture = ({
  visible = false,
  style,
  setVisible,
  disabled,
  children,
  onBack,
  onBackDone,
}) => {
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const dismiss = () => {
    navigation
      .dismissModal()
      .then(() => {})
      .catch(() => {});
  };

  const onStart = () => {
    if (onBack) {
      onBack();
      return;
    }
    runOnJS(dismiss)();
  };

  const leftPanGesture = Gesture.Pan()
    .onStart(onStart)
    .activeOffsetX(10)
    .enabled(!disabled);

  const rightPanGesture = Gesture.Pan()
    .onStart(onStart)
    .activeOffsetX(-10)
    .enabled(!disabled);

  return (
    <>
      <View style={{ flex: 1, ...style }}>
        <GestureDetector gesture={leftPanGesture}>
          <EdgeBackGestureView />
        </GestureDetector>

        {children}

        <GestureDetector gesture={rightPanGesture}>
          <EdgeBackGestureView right />
        </GestureDetector>
      </View>
      <DoubleOptionPopupModal
        title={languageContent.discard_changes}
        onDonePress={() => {
          onBackDone?.();
          Navigation.dismissAllModals();
        }}
        visible={visible}
        setVisible={setVisible}
      />
    </>
  );
};

export default memo(EdgeGesture);

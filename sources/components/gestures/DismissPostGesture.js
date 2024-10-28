import React, { memo } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { runOnJS } from "react-native-reanimated";

const { height } = Dimensions.get("window");

const DismissPostGesture = ({ children, disabled }) => {
  const navigation = useNavigation();

  const panGesture = Gesture.Pan()
    .onChange(({ velocityY }) => {
      if (velocityY > height * 1.5) {
        runOnJS(navigation.dismissModal)();
      }
    })
    .enabled(!disabled);

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default memo(DismissPostGesture);

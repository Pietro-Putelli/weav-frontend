import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useLanguages, useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { IconButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const { width, height } = Dimensions.get("window");

const HIDDEN_TOP = -height * 0.2;
const VISIBLE_TOP = insets.top;

const TutorialBadgeView = ({ type, visible, setVisible }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const top = useSharedValue(HIDDEN_TOP);

  /* Effects */

  useEffect(() => {
    if (visible) {
      top.value = withDelay(1000, withSpring(VISIBLE_TOP, { damping: 12 }));
    } else {
      top.value = withSpring(HIDDEN_TOP, { damping: 12 });
    }
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onChange(({ translationY, velocityY }) => {
      if (velocityY < 0) {
        top.value = withSpring(HIDDEN_TOP, { damping: 12 });
        runOnJS(setVisible)(false);
      } else {
        top.value = translationY / 6 + VISIBLE_TOP;
      }
    })
    .onEnd(() => {
      if (visible) {
        top.value = withSpring(VISIBLE_TOP, { damping: 12 });
      }
    });

  /* Styles */

  const animatedStyle = useAnimatedStyle(() => {
    return { top: top.value };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[theme.styles.shadow_round, styles.container, animatedStyle]}
      >
        <SquareImage source={icons.Idea} coloredIcon />

        <View style={{ marginHorizontal: "3%", flex: 1 }}>
          <MainText bold font="subtitle-1">
            {languageContent.tutorial[type]}
          </MainText>
        </View>

        <IconButton
          onPress={() => {
            setVisible(false);
          }}
          source={icons.Cross}
          inset={4}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default TutorialBadgeView;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: width - 16,
    alignSelf: "center",
    position: "absolute",
    alignItems: "center",
    flexDirection: "row",
  },
});

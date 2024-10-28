import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useNavigation } from "react-native-navigation-hooks/dist";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { insets } from "../styles";

import { FadeAnimatedView } from "../components/animations";
import { MainText } from "../components/texts";
import { useTheme } from "../hooks";

const { width, height } = Dimensions.get("window");
const CURSOR_WIDTH = width * 0.3;

const MAX_OPACITY = 0.7;

const ModalScreen = ({
  title,
  cursor,
  onShow,
  visible,
  children,
  titleStyle,
  contentStyle,
  onGoBack,
  fullScreen,
  disabled,
  onPresented,
  cursorStyle,
  titleContainerStyle,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [containerHeight, setContainerHeight] = useState(height / 2);

  const cursorWidth = useSharedValue(0);
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 16 });

    cursorWidth.value = withDelay(
      250,
      withSpring(CURSOR_WIDTH, { damping: 12 })
    );

    setTimeout(() => {
      onPresented?.();
    }, 650);
  }, []);

  useEffect(() => {
    onShow && onShow();
    if (visible == false) {
      Keyboard.dismiss();

      dismiss();
    }
  }, [visible]);

  // === METHODS

  const onContainerHeight = useCallback(({ nativeEvent: { layout } }) => {
    setContainerHeight(layout.height);
  }, []);

  const onNavigationPop = () => {
    navigation.dismissModal();
  };

  const dismiss = useCallback(() => {
    Keyboard.dismiss();

    translateY.value = withTiming(containerHeight * 1.5, null, (finished) => {
      if (finished) {
        if (onGoBack) runOnJS(onGoBack)();
        else runOnJS(onNavigationPop)();
      }
    });
  }, [containerHeight, onGoBack]);

  // === STYLES

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, containerHeight],
      [MAX_OPACITY, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      height: fullScreen ? height * 0.95 : undefined,
    };
  });

  const panGesture = Gesture.Pan()
    .onChange(({ translationY }) => {
      translateY.value = translationY / 1.5;
      runOnJS(Keyboard.dismiss)();
    })
    .onEnd(({ translationY }) => {
      if (translationY > height / 10) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0);
        onShow && runOnJS(onShow)();
      }
    })
    .enabled(!disabled);

  // === COMPONENTS

  const renderHeader = useCallback(
    () =>
      title != undefined && (
        <View style={[styles.titleContainer, titleContainerStyle]}>
          <MainText
            bold
            capitalize
            font="title-5"
            numberOfLines={1}
            style={[styles.title, titleStyle]}
          >
            {title}
          </MainText>
        </View>
      ),
    [title]
  );

  const cursorAnimationStyle = useAnimatedStyle(() => {
    return {
      width: cursorWidth.value,
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback disabled={disabled} onPress={dismiss}>
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
      </TouchableWithoutFeedback>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              ...theme.styles.shadow_round_second,
              borderRadius: 24,
              marginBottom: insets.bottom,
              paddingBottom: 16,
            },
            animatedContainerStyle,
          ]}
          onLayout={onContainerHeight}
        >
          {cursor && (
            <Animated.View
              style={[
                styles.cursor,
                {
                  marginBottom: title ? "4%" : "6%",
                  backgroundColor: theme.colors.secondText,
                },
                cursorAnimationStyle,
                cursorStyle,
              ]}
            />
          )}

          {renderHeader()}

          <FadeAnimatedView style={[styles.content, contentStyle]}>
            {children}
          </FadeAnimatedView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
export default memo(ModalScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  content: {
    width: width - 12,
    paddingHorizontal: 12,
  },
  backdrop: {
    width,
    height,
    position: "absolute",
    backgroundColor: "black",
  },
  title: {
    flex: 1,
    marginLeft: "2%",
  },
  titleContainer: {
    marginBottom: "4%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
  cursor: {
    height: 4,
    borderRadius: 16,
    alignSelf: "center",
    marginTop: "4%",
  },
});

import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import _ from "lodash";
import React, { memo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { isAndroidDevice } from "../../utility/functions";
import { FadeAnimatedView } from "../animations";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const { width, height } = Dimensions.get("window");

const isAndroid = isAndroidDevice();

const BluredImageBackground = ({ sources = [], scrollX, scrollY }) => {
  if (_.isEmpty(sources)) {
    return null;
  }

  return (
    <FadeAnimatedView
      mode="fade"
      style={[StyleSheet.absoluteFillObject, { overflow: "hidden" }]}
    >
      {sources.map((story, index) => {
        return (
          <BluredImage
            index={index}
            scrollY={scrollY}
            scrollX={scrollX}
            key={index.toString()}
            source={story?.slices?.[0]?.source ?? story.source}
          />
        );
      })}

      <BlurView
        style={StyleSheet.absoluteFillObject}
        tint="dark"
        intensity={100}
      />
    </FadeAnimatedView>
  );
};

export default memo(BluredImageBackground);

const BluredImage = memo(({ scrollY, scrollX, source, index }) => {
  const isHorizontal = scrollX != undefined;
  const cellSide = isHorizontal ? width : height;

  const inputRange = [
    (index - 1) * cellSide,
    index * cellSide,
    (index + 1) * cellSide,
  ];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        (scrollY ?? scrollX).value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <AnimatedImage
      source={{ uri: source }}
      blurRadius={isAndroid ? 50 : 0}
      style={[StyleSheet.absoluteFillObject, animatedStyle]}
    />
  );
});

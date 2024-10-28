import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BORDER_RADIUS, POST_HEIGHT } from "../../styles/sizes";
import { CacheableImageView } from "../images";
import PostTitleView from "./PostTitleView";
import { RFPercentage } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const VERTICAL_OFFSET = RFPercentage(25);

const SliceContent = ({ slice, index, scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * height,
      index * height,
      (index + 1) * height,
    ];

    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            inputRange,
            [0.92, 1, 0.92],
            Extrapolate.CLAMP
          ),
        },
        {
          translateY: interpolate(
            scrollY.value,
            inputRange,
            [-VERTICAL_OFFSET, 0, VERTICAL_OFFSET],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.imageContainer}>
        <CacheableImageView
          resizeMode="contain"
          source={slice?.source}
          style={StyleSheet.absoluteFillObject}
        />

        <PostTitleView slice={slice} />
      </View>
    </Animated.View>
  );
};

export default memo(SliceContent);

const styles = StyleSheet.create({
  container: {
    height,
    width: width - 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    overflow: "hidden",
    height: POST_HEIGHT,
    borderRadius: BORDER_RADIUS,
  },
});

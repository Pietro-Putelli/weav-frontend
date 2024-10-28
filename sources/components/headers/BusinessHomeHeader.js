import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { gradients } from "../../styles";
import { FadeAnimatedView } from "../animations";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { LinearGradient } from "../views";

const { width, height } = Dimensions.get("window");

const HEADER_HEIGHT = height * 0.25;

const BusinessHomeHeader = ({ scrollY, business }) => {
  const { name, cover_source } = business;

  /* Styles */

  const aniamtedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2.5, 1.1, 1],
            Extrapolate.CLAMP
          ),
        },
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT * 4, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT / 2],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.header}>
      <Animated.View style={[styles.imageContainer, aniamtedImageStyle]}>
        <CacheableImageView
          style={StyleSheet.absoluteFill}
          source={cover_source}
        />
      </Animated.View>

      <LinearGradient
        inverted
        style={styles.gradient}
        colors={gradients.DarkProfile}
      >
        <FadeAnimatedView mode="fade-up">
          <MainText
            numberOfLines={2}
            style={{ letterSpacing: 3 }}
            font={"title-4"}
            bold
          >
            {name}
          </MainText>
        </FadeAnimatedView>
      </LinearGradient>
    </View>
  );
};

export default memo(BusinessHomeHeader);

const styles = StyleSheet.create({
  header: {
    width,
    height: HEADER_HEIGHT,
  },
  imageContainer: {
    ...StyleSheet.absoluteFill,
  },
  gradient: {
    height: "100%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    justifyContent: "flex-end",
    paddingLeft: 8,
  },
});

import React, { memo } from "react";
import { Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";

const { width } = Dimensions.get("window");
const MAX_ICON_SIDE = ICON_SIZES.one;
const MAX_X_SWIPE = width / 6;

const ReplyIcon = ({ translateX, icon }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [-MAX_X_SWIPE, 0];

    const scale = interpolate(
      translateX.value,
      inputRange,
      [1, 0],
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      translateX.value,
      inputRange,
      [0, 60],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
      zIndex: -1,
      right: "4%",
      position: "absolute",
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <SquareImage side={MAX_ICON_SIDE} source={icon ?? icons.Reply} />
    </Animated.View>
  );
};

export default memo(ReplyIcon);

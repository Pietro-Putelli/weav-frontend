import React, { memo, useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { triggerHaptic } from "../../utility/haptics";

const ICON_SIDE = ICON_SIZES.two;

const LikeButton = ({ style, side, tint, like, onPress, enabled }) => {
  const theme = useTheme();

  const [disabled, setDisabled] = useState(false);
  const liked = useSharedValue(like ? 1 : 0);
  const _side = side == undefined ? ICON_SIDE : side;

  const tintColor = tint != undefined ? theme.white_alpha(0.6) : "white";

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
    };
  });

  const finished = (f) => {
    "worklet";
    if (f) runOnJS(setDisabled)(false);
  };

  const _onPress = () => {
    setDisabled(true);
    if (liked.value == 0) {
      liked.value = withSpring(1, null, finished);
      triggerHaptic();
    } else {
      liked.value = withTiming(0, null, finished);
    }

    onPress?.(!liked.value);
  };

  const size = {
    width: _side,
    height: _side,
  };

  return (
    <TouchableOpacity
      disabled={disabled || !enabled}
      onPress={_onPress}
      style={style}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          styles.container,
          size,
          outlineStyle,
        ]}
      >
        <Image source={icons.LikeEmpty} style={[styles.image, { tintColor }]} />
      </Animated.View>

      <Animated.View style={[fillStyle, styles.container, size]}>
        <Image
          source={icons.LikeFill}
          style={[styles.image, { tintColor: theme.colors.like }]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};
export default memo(LikeButton);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "96%", height: "96%" },
});

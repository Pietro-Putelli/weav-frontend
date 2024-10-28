import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import moment from "moment";
import { MainText } from "../texts";
import { icons } from "../../styles";
import React, { memo } from "react";
import { useTheme } from "../../hooks";
import { SquareImage } from "../images";
import { Image, StyleSheet } from "react-native";
import { ICON_SIZES, widthPercentage } from "../../styles/sizes";

const INFO_VIEW_OPACITY_LIMIT = widthPercentage(0.125);

const MessageInfoView = ({ translateX, isSender, message }) => {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = isSender
      ? [0, INFO_VIEW_OPACITY_LIMIT]
      : [0, -INFO_VIEW_OPACITY_LIMIT];

    return {
      opacity: interpolate(
        translateX.value,
        inputRange,
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const infoStyle = isSender ? { left: 16 } : { right: 16 };

  return (
    <Animated.View style={[styles.info_container, animatedStyle, infoStyle]}>
      <MainText font={"subtitle-3"}>
        {moment(message.created_at).format("LT")}
      </MainText>

      {isSender && (
        <SquareImage
          side={ICON_SIZES.five}
          source={icons.SeenMessage}
          color={message.seen ? theme.colors.aqua : theme.white_alpha(0.2)}
          style={{ marginLeft: 4 }}
        />
      )}
    </Animated.View>
  );
};

export default memo(MessageInfoView);

const styles = StyleSheet.create({
  info_container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: -1,
    bottom: 12,
  },
});

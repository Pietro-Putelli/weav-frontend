import { MotiView } from "moti";
import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { isAndroidDevice } from "../../utility/functions";
import { MainText } from "../texts";

const BADGE_MIN_WIDTH = ICON_SIZES.two * 0.9;
const BELL_ICON_SIDE = BADGE_MIN_WIDTH * 0.6;

const isAndroid = isAndroidDevice();

const BadgeMessageCount = ({ count, muted }) => {
  const theme = useTheme();

  const has2Digits = count > 9;

  if (!muted && !count) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "4%",
        justifyContent: "flex-end",
        marginRight: 8,
      }}
    >
      {parseInt(count) > 0 && (
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            damping: 16,
          }}
          style={{
            height: BADGE_MIN_WIDTH,
            minWidth: BADGE_MIN_WIDTH,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.main_accent,
            borderRadius: BADGE_MIN_WIDTH / 2.3,
            marginRight: !muted ? 0 : 12,
          }}
        >
          <View style={{ overflow: "hidden" }}>
            <Text
              bold
              key={count}
              entering={FadeInDown}
              exiting={FadeOutUp}
              style={{
                fontSize: RFValue(10),
                textAlign: "center",
                fontWeight: "800",
                paddingHorizontal: 6,
                color: "white",
              }}
            >
              {count > 99 ? "99+" : count}
            </Text>
          </View>
        </MotiView>
      )}

      {muted && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Image
            source={icons.NotificationOffFill}
            style={{
              width: BELL_ICON_SIDE,
              height: BELL_ICON_SIDE,
              tintColor: theme.white_alpha(0.4),
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};
export default BadgeMessageCount;

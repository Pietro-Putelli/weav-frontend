import { MotiView } from "moti";
import React, { useMemo, useRef } from "react";
import { useTheme } from "../../hooks";
import { fonts, typographies } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { MainText } from "../texts";
import { isAndroidDevice } from "../../utility/functions";
import { RFValue } from "react-native-responsive-fontsize";
import { Text } from "react-native";

const BADGE_SIDE = ICON_SIZES.four;
const NO_TEXT_BADGE_SIDE = ICON_SIZES.four * 0.6;

const isAndroid = isAndroidDevice();

const BadgeCountView = ({ count, noText, scale = 1, style }) => {
  const theme = useTheme();
  const isVisible = count != 0 && count;

  const prevCount = useRef(count);

  const displayCount = useMemo(() => {
    if (count < 10) {
      if (count == 0) {
        return prevCount.current;
      } else {
        prevCount.current = count;
      }

      return count;
    }

    return "9+";
  }, [count]);

  return (
    <MotiView
      animate={{ scale: isVisible ? 1 : 0 }}
      transition={{ type: "timing" }}
      style={{
        top: noText ? 0 : -4,
        right: noText ? -2 : -4,
        zIndex: 1,
        paddingHorizontal: 4,
        minWidth: noText ? NO_TEXT_BADGE_SIDE : BADGE_SIDE * scale,
        height: noText ? NO_TEXT_BADGE_SIDE : BADGE_SIDE * scale,
        alignItems: "center",
        position: "absolute",
        justifyContent: "center",
        borderRadius: (BADGE_SIDE / 2.25) * scale,
        backgroundColor: theme.colors.main_accent,
        ...style,
      }}
    >
      {!noText && (
        <Text
          color={"white"}
          style={{
            fontSize: RFValue(8.8) * scale,
            textAlign: "center",
            alignSelf: "center",
            marginLeft: isAndroid ? 0 : 1,
            color: "white",
            fontWeight: "700",
          }}
        >
          {displayCount}
        </Text>
      )}
    </MotiView>
  );
};

export default BadgeCountView;

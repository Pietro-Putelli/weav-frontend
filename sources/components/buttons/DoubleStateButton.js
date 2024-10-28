import { MotiView } from "moti";
import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { BORDER_RADIUS, BUTTON_HEIGHT, ICON_SIZES } from "../../styles/sizes";
import { AnimatedBackgroundColorView } from "../animations";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const DoubleStateButton = ({
  isActive,
  style,
  onPress,
  titles,
  colors,
  icons,
  ...props
}) => {
  const theme = useTheme();

  const _colors = useMemo(() => {
    if (!colors) {
      return [theme.colors.main_accent];
    }
    return colors;
  }, [colors]);

  return (
    <BounceView
      onPress={onPress}
      haptic
      style={[
        theme.styles.shadow_round,
        {
          height: BUTTON_HEIGHT,
          borderRadius: BORDER_RADIUS * 1.3,
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      <AnimatedBackgroundColorView
        isActive={isActive}
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          },
        ]}
        colors={_colors}
      >
        <MotiView
          style={{ flexDirection: "row" }}
          animate={{ scale: isActive ? 0 : 1 }}
          transition={{ type: !isActive ? "spring" : "timing", damping: 12 }}
        >
          {icons[0] && (
            <SquareImage
              source={icons[0]}
              side={ICON_SIZES.four}
              style={{ marginRight: 8, marginTop: 0 }}
            />
          )}

          <MainText font="subtitle-2" uppercase bold>
            {titles[0]}
          </MainText>
        </MotiView>

        <MotiView
          style={{ flexDirection: "row", position: "absolute" }}
          animate={{ scale: !isActive ? 0 : 1 }}
          transition={{ type: isActive ? "spring" : "timing", damping: 12 }}
        >
          <SquareImage
            source={icons[1]}
            side={ICON_SIZES.three}
            style={{ marginRight: 8 }}
          />

          <MainText style={{ bottom: 0.5 }} font="subtitle-2" uppercase bold>
            {titles[1]}
          </MainText>
        </MotiView>
      </AnimatedBackgroundColorView>
    </BounceView>
  );
};

export default memo(DoubleStateButton);

import { MotiView } from "moti";
import React from "react";
import { useTheme } from "../../hooks";
import { BORDER_RADIUS, ICON_SIZES, widthPercentage } from "../../styles/sizes";
import { SquareImage } from "../images";
import { BounceView } from "../views";

const BUTTON_SIDE = widthPercentage(0.135);

const AdjacentTabBarButton = ({ icon, iconSize, onPress }) => {
  const theme = useTheme();

  return (
    <MotiView
      style={{
        position: "absolute",
        right: -BUTTON_SIDE - 10,
      }}
      animate={{
        translateY: 0,
      }}
      from={{
        translateY: 100,
      }}
      transition={{
        damping: 16,
      }}
    >
      <BounceView
        onPress={onPress}
        haptic
        style={[
          theme.styles.shadow_round,
          {
            borderRadius: BORDER_RADIUS * 1.5,
            width: BUTTON_SIDE,
            height: BUTTON_SIDE,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <SquareImage side={iconSize} source={icon} />
      </BounceView>
    </MotiView>
  );
};

export default AdjacentTabBarButton;

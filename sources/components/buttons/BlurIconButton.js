import { BlurView } from "expo-blur";
import React from "react";
import { SCREENS } from "../../constants/screens";
import { useTheme } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import { BORDER_RADIUS } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";
import { ScaleAnimatedView } from "../animations";
import { formatLargeNumber } from "../../utility/formatters";

const BlurIconButton = ({
  event,
  business,
  isColored,
  count,
  isInverted,
  icon = icons.Repost,
  onPress,
}) => {
  const theme = useTheme();

  if (!count || count <= 0) {
    return null;
  }

  const _onPress = () => {
    if (onPress) {
      onPress();
    } else {
      showStackModal({
        screen: SCREENS.CreateMoment,
        passProps: {
          initialMoment: { event, business_tag: business },
        },
      });
    }
  };

  return (
    <ScaleAnimatedView delay={200}>
      <BounceView
        onPress={_onPress}
        haptic
        style={{
          borderRadius: BORDER_RADIUS * 1.3,
          overflow: "hidden",
        }}
      >
        <BlurView
          tint="dark"
          intensity={isColored ? 0 : 100}
          style={{
            height: 48,
            paddingHorizontal: 16,
            flexDirection: isInverted ? "row-reverse" : "row",
            alignItems: "center",
            backgroundColor: isColored
              ? theme.colors.main_accent
              : "transparent",
          }}
        >
          <MainText
            bold
            font="subtitle-1"
            style={{
              marginRight: isInverted ? 0 : 6,
              marginLeft: isInverted ? 8 : 0,
            }}
          >
            {formatLargeNumber(count)}
          </MainText>

          <SquareImage source={icon} percentage={0.55} />
        </BlurView>
      </BounceView>
    </ScaleAnimatedView>
  );
};

export default BlurIconButton;

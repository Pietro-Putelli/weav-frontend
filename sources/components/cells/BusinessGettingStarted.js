import React, { memo } from "react";
import { SCREENS } from "../../constants/screens";
import { useTheme } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES, widthPercentage } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const CHEVRON = ICON_SIZES.chevron_right;
const ICON_SIDE = widthPercentage(0.1);

const BusinessGettingStarted = () => {
  const theme = useTheme();

  return (
    <BounceView
      onPress={() => {
        showStackModal({ screen: SCREENS.CreateEvent });
      }}
      style={[
        {
          marginTop: "3%",
          flexDirection: "row",
          alignItems: "center",
          padding: "4%",
          paddingHorizontal: 12,
        },
        theme.styles.shadow_round,
      ]}
    >
      <SquareImage
        source={icons.ColoredCocktail}
        coloredIcon
        side={ICON_SIDE}
      />
      <MainText style={{ flex: 1, marginHorizontal: 8 }} bold font="subtitle-1">
        Share you events, all people in Padua will see them.
      </MainText>

      <SquareImage
        side={CHEVRON}
        color={theme.white_alpha(0.3)}
        source={icons.Chevrons.Right}
      />
    </BounceView>
  );
};

export default memo(BusinessGettingStarted);

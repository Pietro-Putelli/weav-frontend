import React, { memo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { ScaleAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import BadgeView from "./BadgeView";

const ICON_SIDE = ICON_SIZES.two * 0.8;

const ErrorBadgeView = ({ title, visible, ...props }) => {
  const theme = useTheme();

  return (
    <BadgeView hideAfter={1500} visible={visible} {...props}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ScaleAnimatedView
          delay={200}
          style={{ width: ICON_SIDE, height: ICON_SIDE, marginRight: 8 }}
        >
          <SquareImage
            side={ICON_SIDE}
            source={icons.CircleCross}
            color={theme.colors.red}
          />
        </ScaleAnimatedView>
        <MainText bold font="subtitle-1" uppercase style={{ marginLeft: "2%" }}>
          {title}
        </MainText>
      </View>
    </BadgeView>
  );
};
export default memo(ErrorBadgeView);

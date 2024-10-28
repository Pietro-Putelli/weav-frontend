import React, { memo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const SolidIconCell = ({ title, icon, coloredIcon, flex, marginRight }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        theme.styles.shadow_round,
        {
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flex: flex ? 1 : 0,
          marginRight: marginRight ? "3%" : 0,
        },
      ]}
    >
      <SquareImage
        side={ICON_SIZES.two}
        source={icon}
        coloredIcon={coloredIcon}
      />
      <MainText bold style={{ marginLeft: 12, flex: 1 }} font="subtitle">
        {title}
      </MainText>
    </View>
  );
};

export default memo(SolidIconCell);

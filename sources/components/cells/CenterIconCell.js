import React, { memo } from "react";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const CenterIconCell = ({ title, icon, style, onPress, color, ...props }) => {
  const theme = useTheme();

  return (
    <BounceView
      onPress={onPress}
      style={{
        flex: 1,
        padding: "4%",
        alignItems: "center",
        justifyContent: "center",
        ...theme.styles.shadow_round,
        ...style,
      }}
      {...props}
    >
      <Animated.View>
        <SquareImage
          source={icon}
          side={ICON_SIZES.two}
          color={title == "delete" ? theme.colors.red : theme.colors.text}
        />
      </Animated.View>
      <MainText
        uppercase
        font="subtitle-1"
        align="center"
        style={{ marginTop: "8%" }}
      >
        {title}
      </MainText>
    </BounceView>
  );
};

export default memo(CenterIconCell);

import React, { memo } from "react";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const SIDE = ICON_SIZES.two;

const CenterIconButton = ({
  title,
  icon,
  style,
  onPress,
  tintColor,
  ...props
}) => {
  const theme = useTheme();

  return (
    <BounceView
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
        ...theme.styles.shadow_round,
        ...style,
      }}
      {...props}
    >
      <Animated.View>
        <SquareImage
          side={SIDE}
          source={icon}
          color={tintColor ? tintColor : theme.colors.secondText}
        />
      </Animated.View>
      <MainText
        align="center"
        font="subtitle-3"
        color={theme.colors.text}
        uppercase
        bold
        style={[{ marginTop: 16 }]}
      >
        {title}
      </MainText>
    </BounceView>
  );
};

export default memo(CenterIconButton);

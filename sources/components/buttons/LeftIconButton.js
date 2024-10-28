import React, { memo } from "react";
import { useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const SIDE = ICON_SIZES.two;

const LeftIconButton = ({
  title,
  icon,
  style,
  inset = 0,
  tintColor,
  ...props
}) => {
  const theme = useTheme();

  return (
    <BounceView
      {...props}
      style={{
        alignItems: "center",
        flexDirection: "row",
        padding: 14,
        paddingHorizontal: "6%",
        ...theme.styles.shadow_round,
        ...style,
      }}
    >
      <SquareImage source={icon} side={SIDE - 2 * inset} />
      <MainText
        font="subtitle-3"
        bold
        style={{
          textAlign: "center",
          textTransform: "uppercase",
          flex: 1,
        }}
      >
        {title}
      </MainText>
    </BounceView>
  );
};

export default memo(LeftIconButton);

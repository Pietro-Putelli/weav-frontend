import React, { memo } from "react";
import { Image } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";

const SIDE = RFPercentage(4);

const SquareImage = ({
  coloredIcon,
  side = SIDE,
  percentage = 1,
  color,
  style,
  inset = 0,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Image
      style={{
        width: side * percentage - inset * 2,
        height: side * percentage - inset * 2,
        tintColor: coloredIcon ? undefined : color ?? theme.colors.text,
        ...style,
      }}
      source={{
        ...props.source,
        cache: "force-cache",
      }}
      {...props}
    />
  );
};

export default memo(SquareImage);

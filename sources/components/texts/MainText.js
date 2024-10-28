import React, { memo } from "react";
import Animated from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { fonts, typographies } from "../../styles";

const MainText = ({
  children,
  font = "",
  bold,
  uppercase,
  style,
  align,
  lineHeight = 1,
  color,
  type,
  capitalize,
  letterSpacing,
  isNumbers,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Animated.Text
      {...props}
      style={[
        {
          fontSize: typographies.fontSizes[font.replace("-", "")],
          textTransform: uppercase
            ? "uppercase"
            : capitalize
            ? "capitalize"
            : "none",
          textAlign: align,
          color: color ?? theme.colors.text,
          letterSpacing: letterSpacing ? letterSpacing : 1.2,
          includeFontPadding: false,
          fontFamily: bold ? fonts.Bold : fonts.Medium,
          paddingTop: 0,
          padding: 0,
        },
        style,
      ]}
    >
      {children}
    </Animated.Text>
  );
};
export default memo(MainText);

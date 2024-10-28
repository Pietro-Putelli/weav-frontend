import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { gradients } from "../../styles";

const START = { x: 1, y: 1 };
const END = { x: 1, y: 0 };

const LinearGradientView = ({
  children,
  isFromTop,
  isDark,
  colors,
  ...props
}) => {
  return (
    <LinearGradient
      end={isFromTop ? START : END}
      start={isFromTop ? END : START}
      colors={colors ?? gradients[isDark ? "Shadow" : "LightShadow"]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default memo(LinearGradientView);

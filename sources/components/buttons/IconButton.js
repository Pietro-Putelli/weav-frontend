import { BlurView } from "expo-blur";
import { isNumber } from "lodash";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { BounceView } from "../views";

const IconButton = ({
  source,
  style,
  inset = 0,
  side = "two",
  blur,
  color,
  solid,
  ...props
}) => {
  const theme = useTheme();

  const _color = color == undefined ? theme.colors.text : color;
  const _side = isNumber(side) ? side : parseFloat(ICON_SIZES[side]);

  let solidStyle = {};

  const size = {
    width: _side * 2,
    height: _side * 2,
  };

  if (solid) {
    solidStyle = {
      padding: 24,
      ...theme.styles.shadow_round,
    };
  }

  if (blur) {
    return (
      <BounceView
        activeScale={0.9}
        style={[styles.container, size, style]}
        {...props}
      >
        <BlurView
          tint="dark"
          intensity={80}
          style={[
            styles.blur,
            {
              ...size,
              borderRadius: _side / 1.1,
              overflow: "hidden",
            },
          ]}
        >
          <SquareImage
            side={_side - 2 * inset}
            source={source}
            color={_color}
          />
        </BlurView>
      </BounceView>
    );
  }

  return (
    <BounceView
      activeScale={0.8}
      style={[
        styles.container,
        solidStyle,
        {
          width: _side,
          height: _side,
          ...style,
        },
      ]}
      {...props}
    >
      <SquareImage side={_side - 2 * inset} source={source} color={_color} />
    </BounceView>
  );
};
export default memo(IconButton);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  blur: {
    alignItems: "center",
    justifyContent: "center",
  },
});

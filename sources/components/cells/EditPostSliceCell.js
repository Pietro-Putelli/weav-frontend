import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { CacheableImageView, SquareImage } from "../images";
import { FadeView } from "../views";

const CHECK_ICON_SIDE = ICON_SIZES.two * 1.2;

const EditPostSliceCell = ({ slice, selected, style, ...props }) => {
  const theme = useTheme();

  if (Number.isInteger(slice))
    return <View style={[style, { backgroundColor: "black" }]} />;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ overflow: "hidden", borderRadius: 4, ...style }}
      {...props}
    >
      <CacheableImageView
        source={slice.source}
        style={StyleSheet.absoluteFillObject}
      />

      <FadeView
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "flex-end",
            alignItems: "flex-end",
            backgroundColor: "rgba(0,0,0,0.6)",
            paddingBottom: 6,
            paddingRight: 6,
          },
        ]}
        hidden={!selected}
      >
        <SquareImage
          side={CHECK_ICON_SIDE}
          source={icons.CircleCheck}
          color={theme.colors.aqua}
        />
      </FadeView>
    </TouchableOpacity>
  );
};

export default memo(EditPostSliceCell);

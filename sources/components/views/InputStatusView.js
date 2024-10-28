import { MotiView } from "moti";
import React, { memo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";

const CONTAINER_SIDE = ICON_SIZES.three;

const transition = {
  type: "timing",
};

const InputStatusView = ({ valid, style }) => {
  const theme = useTheme();

  return (
    <View style={[style, { width: CONTAINER_SIDE, height: CONTAINER_SIDE }]}>
      <MotiView transition={transition} animate={{ scale: valid ? 1 : 0 }}>
        <SquareImage
          side={CONTAINER_SIDE}
          color={theme.colors.green}
          source={icons.CircleCheck}
        />
      </MotiView>

      <MotiView
        transition={transition}
        animate={{ scale: valid ? 0 : 1 }}
        style={{ position: "absolute", zIndex: -1 }}
      >
        <SquareImage
          side={CONTAINER_SIDE}
          color={theme.colors.red}
          source={icons.CircleCross}
        />
      </MotiView>
    </View>
  );
};

export default memo(InputStatusView);

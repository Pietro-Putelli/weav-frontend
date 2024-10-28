import React, { memo, useMemo } from "react";
import { Marker } from "react-native-maps";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { useTheme } from "../../hooks";

const SIDE = ICON_SIZES.one * 1.5;

const CustomMarker = ({ coordinate, color }) => {
  const theme = useTheme();

  const key = useMemo(() => {
    return coordinate?.longitude?.toString();
  }, [coordinate]);

  if (!key) {
    return null;
  }

  return (
    <Marker image={null} coordinate={coordinate}>
      <SquareImage
        side={SIDE}
        color={color ?? theme.colors.main_accent}
        source={icons.ColoredMarker}
      />
    </Marker>
  );
};

export default memo(CustomMarker);

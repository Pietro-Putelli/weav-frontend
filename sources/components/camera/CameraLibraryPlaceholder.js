import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";

const CameraLibraryPlaceholder = ({ style, ...props }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.second_background },
      ]}
    >
      <SquareImage side={ICON_SIZES.one * 1.5} source={icons.Camera} />
    </View>
  );
};

export default memo(CameraLibraryPlaceholder);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

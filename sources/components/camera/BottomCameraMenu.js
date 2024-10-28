import { BlurView } from "expo-blur";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { icons, insets } from "../../styles";
import { IconButton } from "../buttons";
import { MainText } from "../texts";

const ICON_SIDE = RFPercentage(2.8);
const ICON_SIDE_1 = RFPercentage(3.4);

const BottomCameraMenu = ({
  onLibraryPress,
  onFlipCamera,
  isLibraryDisabled,
}) => {
  return (
    <View style={styles.container}>
      {!isLibraryDisabled && (
        <IconButton
          blur
          onPress={onLibraryPress}
          source={icons.Library}
          side={ICON_SIDE}
        />
      )}

      <IconButton
        haptic
        blur
        onPress={onFlipCamera}
        source={icons.FlipCamera}
        side={ICON_SIDE}
      />
    </View>
  );
};

export default memo(BottomCameraMenu);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: "4%",
    paddingBottom: insets.bottom,
  },
});

import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { icons } from "../../styles";
import { IconButton } from "../buttons";

const ICON_SIDE = RFPercentage(3);
const ICON_CONTAINER_SIDE = RFPercentage(7);

const TopCameraMenu = ({ onClosePress, onChangeFlash, isFlashEnabled }) => {
  return (
    <View style={styles.container}>
      <IconButton
        haptic
        side={ICON_SIDE}
        onPress={onChangeFlash}
        source={icons[!isFlashEnabled ? "FlashOff" : "FlashOn"]}
        style={styles.button}
      />
      <IconButton
        haptic
        inset={2}
        side={ICON_SIDE}
        source={icons.Cross}
        onPress={onClosePress}
        style={styles.button}
      />
    </View>
  );
};
export default memo(TopCameraMenu);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    zIndex: 100,
    flexDirection: "row",
    marginTop: "1.5%",
    justifyContent: "space-between",
  },
  button: {
    width: ICON_CONTAINER_SIDE,
    height: ICON_CONTAINER_SIDE,
  },
});

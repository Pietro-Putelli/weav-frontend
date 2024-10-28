import React, { memo } from "react";
import { Dimensions, Linking, StyleSheet } from "react-native";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const { width, height } = Dimensions.get("window");
const ICON_SIDE = widthPercentage(0.2);

const LocationPermissionPlaceholder = () => {
  return (
    <FadeAnimatedView style={styles.container}>
      <SquareImage
        coloredIcon
        source={icons.ColoredMarker}
        side={ICON_SIDE}
        style={styles.icon}
      />
      <MainText font="subtitle" align="center" style={styles.text}>
        To find moments around you, please enable location permission.
      </MainText>

      <SolidButton
        type="done"
        title="open settings"
        style={styles.button}
        icon={icons.MyLocation}
        onPress={() => {
          Linking.openSettings();
        }}
      />
    </FadeAnimatedView>
  );
};

export default memo(LocationPermissionPlaceholder);

const styles = StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: "8%",
  },
  text: {
    marginHorizontal: "8%",
  },
  button: {
    width: "80%",
    marginTop: "8%",
  },
});

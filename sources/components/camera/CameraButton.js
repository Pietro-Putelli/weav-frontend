import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { CAMERA_BUTTON_SIDE } from "../../styles/sizes";
import { triggerHapticOnce } from "../../utility/haptics";
import { BounceView } from "../views";

const CameraButton = forwardRef(
  ({ isFlashEnabled, onMediaCaptured, style }, cameraRef) => {
    const takePhotoOptions = useMemo(
      () => ({
        photoCodec: "jpeg",
        qualityPrioritization: "speed",
        flash: isFlashEnabled ? "on" : "off",
        quality: 90,
        skipMetadata: true,
      }),
      [isFlashEnabled]
    );

    const onPhotoPress = useCallback(async () => {
      if (!cameraRef.current) {
        return;
      }

      const photo = await cameraRef.current.takePhoto(takePhotoOptions);

      const { height, width, path } = photo;

      /* Invert width and height because I don't know why the library inverteded them. */

      setTimeout(() => {
        onMediaCaptured({
          height: width,
          width: height,
          uri: path,
        });
      }, 100);

      triggerHapticOnce();
    }, [onMediaCaptured, takePhotoOptions]);

    return (
      <View style={style}>
        <BounceView
          onPress={onPhotoPress}
          style={styles.container}
        ></BounceView>
      </View>
    );
  }
);
export default React.memo(CameraButton);

const styles = StyleSheet.create({
  container: {
    width: CAMERA_BUTTON_SIDE,
    height: CAMERA_BUTTON_SIDE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CAMERA_BUTTON_SIDE / 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
  },
});

import React, { useMemo, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import InstagramLikeImageCropper from "react-native-instagram-like-image-cropper";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { SolidButton } from "../../components/buttons";
import { actiontypes, imagesizes } from "../../constants";
import { useLanguages, useTheme } from "../../hooks";
import { icons, insets } from "../../styles";

const { width } = Dimensions.get("window");
const CROP_TYPES = actiontypes.CROP_TYPES;

const PhotoCropScreen = ({ photo, cropType, onPhotoCropped }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const { languageContent } = useLanguages();

  const initialPhoto = useMemo(() => {
    return {
      width: Math.max(photo.width, photo.width + 10),
      ...photo,
    };
  }, []);

  const [croppedPhoto, setCroppedPhoto] = useState(initialPhoto);

  const cropAreaSize = useMemo(() => {
    if (cropType == CROP_TYPES.USER) {
      return { width: width, height: width };
    }

    if (cropType == CROP_TYPES.VENUE) {
      return imagesizes.BUSINESS_COVER;
    }

    return {};
  }, [cropType]);

  const cropContainerStyle = useMemo(() => {
    return {
      borderRadius: cropType == CROP_TYPES.USER ? width / 2.3 : 8,
      overflow: "hidden",
      backgroundColor: theme.colors.second_background,
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={cropContainerStyle}>
        <InstagramLikeImageCropper
          gridColor="#FFFFFF60"
          image={photo}
          {...cropAreaSize}
          onCropped={({ croppedUri }) => {
            Image.getSize(croppedUri, (width, height) => {
              setCroppedPhoto({
                uri: croppedUri,
                width,
                height,
              });
            });
          }}
        />
      </View>

      <View style={styles.buttons_container}>
        <SolidButton
          onPress={() => {
            navigation.pop();
          }}
          flex
          marginRight
          title={languageContent.buttons.back}
          icon={icons.Chevrons.Left}
        />
        <SolidButton
          loadingOnPress
          onPress={() => {
            onPhotoCropped(croppedPhoto);

            navigation.dismissModal();
          }}
          flex
          type="done"
          title="done"
        />
      </View>
    </View>
  );
};
export default PhotoCropScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons_container: {
    zIndex: 2,
    bottom: insets.bottom,
    position: "absolute",
    flexDirection: "row",
    marginHorizontal: 8,
    paddingBottom: 16,
  },
});

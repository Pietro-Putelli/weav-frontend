import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { SocialLoginAPI, UserAPI } from "../../backend";
import { FadeAnimatedView } from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { ProfilePicture, SquareImage } from "../../components/images";
import { TermsView } from "../../components/register";
import { MainText } from "../../components/texts";
import { imagesizes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { saveUserLoginData } from "../../handlers/user";
import { useLanguages, useTheme } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import {
  getUserLoginData,
  setLoginData,
} from "../../store/slices/utilityReducer";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { isNullOrUndefined } from "../../utility/boolean";
import { openPicker } from "../../utility/imagepicker";
import { requestMediaLibraryPermission } from "../../utility/permissions";
import { getDeviceType } from "../../utility/device";

const PROFILE_IMAGE_SIDE = widthPercentage(0.6);

const ProfilePictureLoginScreen = ({ isProfileSignup }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { languageContent, language } = useLanguages();

  const { username, name, email, picture } = useSelector(getUserLoginData);

  const [isLoading, setIsLoading] = useState(false);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const isDoneDisabled = isNullOrUndefined(picture) || !isImageLoaded;

  /* Callbacks */

  const onCameraPress = () => {
    showModalNavigation({
      screen: SCREENS.Camera,
      fullscreen: true,
      passProps: {
        isModal: true,
        isLibraryDisabled: true,
        initialCameraPosition: "front",
        onMediaCaptured: (image) => {
          dispatch(setLoginData({ picture: image.uri }));
        },
      },
    });
  };

  const onLibraryPress = () => {
    dispatch(
      requestMediaLibraryPermission(() => {
        openPicker(
          {
            ...imagesizes.PROFILE,
            cropperCircleOverlay: true,
          },
          (image) => {
            dispatch(setLoginData({ picture: image.uri }));
          }
        );
      })
    );
  };

  const signUpCallback = (data) => {
    dispatch(saveUserLoginData(data));
  };

  const onSignPress = () => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("picture", {
        uri: picture,
        type: "image/png",
        name: "picture.png",
      });

      const osType = getDeviceType();

      const data = JSON.stringify({
        username,
        name,
        email,
        language,
        os_type: osType,
      });

      formData.append("data", data);

      if (isProfileSignup) {
        UserAPI.signUpWithUsername(formData, signUpCallback);
      } else {
        SocialLoginAPI.login(formData, signUpCallback);
      }
    } catch (error) {
      throw error;
    }
  };

  const onLoadImageEnd = () => {
    setIsImageLoaded(true);
  };

  const renderPlacehoder = () => {
    return (
      <View style={styles.imagePlaceholder}>
        <SquareImage
          source={icons.Add}
          side={PROFILE_IMAGE_SIDE / 5}
          color={theme.colors.secondText}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={theme.styles.container}>
      <View style={styles.container}>
        <FadeAnimatedView mode="fade-up" style={styles.textsCotainer}>
          <MainText font="title-4" bold>
            {languageContent.login_titles.choose_profile_picture}
          </MainText>
        </FadeAnimatedView>

        <View style={styles.content}>
          <ProfilePicture
            source={picture}
            onPress={onLibraryPress}
            side={PROFILE_IMAGE_SIDE}
            style={styles.profilePicture}
            renderPlacehoder={renderPlacehoder}
            onLoad={onLoadImageEnd}
          />

          <SolidButton
            icon={icons.Camera}
            onPress={onCameraPress}
            style={{ marginTop: "6%" }}
            title={languageContent.buttons.open_camera}
          />
        </View>
      </View>

      <FadeAnimatedView style={styles.bottomContainer}>
        <TermsView />

        <SolidButton
          haptic
          type="done"
          title={languageContent.buttons.jump_in}
          onPress={onSignPress}
          style={styles.button}
          loading={isLoading}
          disabled={isDoneDisabled}
        />
      </FadeAnimatedView>
    </SafeAreaView>
  );
};

export default ProfilePictureLoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: "8%" },
  errorContainer: {
    position: "absolute",
    alignSelf: "center",
    top: "-55%",
  },
  textsCotainer: {
    paddingHorizontal: "6%",
  },
  bottomContainer: {
    paddingHorizontal: "4%",
    paddingBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: "4%",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    width: PROFILE_IMAGE_SIDE,
    height: PROFILE_IMAGE_SIDE,
  },
  buttons: {
    marginTop: "6%",
    marginBottom: "2%",
    flexDirection: "row",
  },
});

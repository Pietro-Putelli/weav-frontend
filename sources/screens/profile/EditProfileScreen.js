import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Rect, Svg } from "react-native-svg";
import { FadeAnimatedView } from "../../components/animations";
import { DoubleTitleCell } from "../../components/cells";
import { MainScrollView } from "../../components/containers";
import { ProfilePicture } from "../../components/images";
import { BounceView, LoaderView } from "../../components/views";
import { imagesizes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import {
  useLanguages,
  useProfilePicture,
  useTheme,
  useUser,
} from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { isAndroidDevice } from "../../utility/functions";
import { openPicker } from "../../utility/imagepicker";
import { isNullOrEmpty } from "../../utility/strings";

const { width } = Dimensions.get("window");

const COVER_SIDE = width / 2.6;
const RADIUS = COVER_SIDE / 2.25;
const STROKE_WIDTH = 4;
const SVG_SIDE = COVER_SIDE - STROKE_WIDTH * 2;
const CIRCLE_LENGTH = RADIUS * 2.25 * Math.PI;
const PROFILE_IMAGE_SIDE = COVER_SIDE - STROKE_WIDTH * 4.5;

const AnimatedCircle = Animated.createAnimatedComponent(Rect);

const isAndroid = isAndroidDevice();

function getValueForKey(title, object) {
  for (var property in object) {
    if (
      object.hasOwnProperty(property) &&
      property.toString().startsWith(title)
    ) {
      return object[property];
    }
  }
}

const EditProfileScreen = () => {
  const user = useUser();

  const hasBio = !isNullOrEmpty(user.bio);
  const hasInstagram = !isNullOrEmpty(user.instagram);

  const { changePicture, isLoading: isLoadingPicture } = useProfilePicture();

  const progress = useSharedValue(1);

  const theme = useTheme();
  const { languageContent } = useLanguages();

  const items = useMemo(() => {
    return [
      { title: "username", screen: SCREENS.EditUsername },
      { title: "name", screen: SCREENS.EditName },
      { title: "bio", screen: SCREENS.EditBio },
      { title: "instagram", screen: SCREENS.EditInstagram },
      { title: "link", screen: SCREENS.EditLink },
    ];
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCLE_LENGTH * progress.value,
    };
  });

  useEffect(() => {
    let progressCount = 2;

    if (hasBio) {
      progressCount--;
    }

    if (hasInstagram) {
      progressCount--;
    }

    progress.value = withTiming(progressCount / 2, {
      duration: 1000,
    });
  }, [user]);

  /* Callbacks */

  const onNavigate = (item) => {
    showStackModal({
      fullscreen: false,
      screen: item.screen,
    });
  };

  const onProfilePicturePress = () => {
    openPicker(
      {
        ...imagesizes.PROFILE,
        cropperCircleOverlay: true,
      },
      (image) => {
        changePicture({ uri: image.uri });
      }
    );
  };

  return (
    <MainScrollView
      contentStyle={{ alignItems: "center" }}
      title={languageContent.header_titles.edit_profile}
    >
      <BounceView
        onPress={onProfilePicturePress}
        style={styles.profileContainer}
      >
        <View style={styles.coverContainer}>
          <Svg
            style={{
              transform: [{ rotate: isAndroid ? "-90deg" : "90deg" }],
            }}
          >
            <AnimatedCircle
              rx={RADIUS}
              y={STROKE_WIDTH}
              x={STROKE_WIDTH}
              width={SVG_SIDE}
              height={SVG_SIDE}
              strokeWidth={STROKE_WIDTH}
              stroke={theme.colors.main_accent}
              fill="transparent"
              animatedProps={animatedProps}
              strokeDasharray={CIRCLE_LENGTH}
            />
          </Svg>

          <ProfilePicture
            disabled
            removeOutline
            source={user.picture}
            side={PROFILE_IMAGE_SIDE}
            style={styles.profileImage}
          />

          {isLoadingPicture && (
            <FadeAnimatedView mode="fade" style={styles.loaderContainer}>
              <LoaderView />
            </FadeAnimatedView>
          )}
        </View>
      </BounceView>

      <View style={{ marginTop: "4%" }}>
        {items.map((item, index) => {
          let subtitle = getValueForKey(item.title, user);

          return (
            <DoubleTitleCell
              key={index}
              title={item.title}
              subtitle={subtitle}
              onPress={() => onNavigate(item)}
              showDot={
                (!hasBio === true && item.title === "bio") ||
                (!hasInstagram === true && item.title === "instagram")
              }
            />
          );
        })}
      </View>
    </MainScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  changePictureContainer: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 11,
    position: "absolute",
    bottom: 0,
    zIndex: 2,
  },
  profileContainer: { marginTop: "4%", alignItems: "center" },
  coverContainer: {
    width: COVER_SIDE,
    height: COVER_SIDE,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    position: "absolute",
  },
  loaderContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: PROFILE_IMAGE_SIDE,
    height: PROFILE_IMAGE_SIDE,
    borderRadius: PROFILE_IMAGE_SIDE / 2.25,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

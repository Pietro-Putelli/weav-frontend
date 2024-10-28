import React, { memo } from "react";
import { Dimensions, Image, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { useLanguages, useTheme } from "../../hooks";
import { icons, images, insets } from "../../styles/";
import { requestPermissionForType } from "../../utility/permissions";
import { FadeAnimatedView } from "../animations";
import { IconButton, SolidButton } from "../buttons";
import { MainText } from "../texts";

const { width, height } = Dimensions.get("window");

const CameraPermissionsPlaceholder = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView
      mode="fade"
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={images.CameraBg}
        style={{ position: "absolute", width, height }}
      />

      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          right: 16,
        }}
      >
        <IconButton
          source={icons.Cross}
          inset={2}
          onPress={() => {
            navigation.dismissModal();
          }}
        />
      </View>

      <View
        style={[
          theme.styles.shadow_round,
          { padding: "6%", maxWidth: "90%", backgroundColor: "#110D2199" },
        ]}
      >
        <MainText style={{ marginBottom: 16 }} align="center" font="title-8">
          {languageContent.grant_camera_placeholder}
        </MainText>
        <SolidButton
          onPress={() => {
            dispatch(requestPermissionForType("camera"));
          }}
          type="done"
          icon={icons.Camera}
          title={languageContent.buttons.enable_camera}
        />
      </View>
    </FadeAnimatedView>
  );
};

export default memo(CameraPermissionsPlaceholder);

import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { requestMediaLibraryPermission } from "../../utility/permissions";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const CONTENT_SIDE = widthPercentage(0.7);

const MediaLibraryPlaceholder = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const containerStyle = useMemo(() => {
    return { ...styles.container, ...theme.styles.shadow_round };
  }, []);

  const onPress = () => {
    dispatch(requestMediaLibraryPermission());
  };

  return (
    <FadeAnimatedView style={containerStyle}>
      <SquareImage
        coloredIcon
        side={CONTENT_SIDE / 5}
        source={icons.MediaLibrary}
        style={styles.icon}
      />

      <MainText
        bold
        align="center"
        font="subtitle"
        style={{ marginHorizontal: "6%" }}
      >
        {languageContent.placeholders.allow_access_to_media}
      </MainText>
      <SolidButton
        onPress={onPress}
        type="done"
        title="Allow"
        style={styles.button}
      />
    </FadeAnimatedView>
  );
};

export default memo(MediaLibraryPlaceholder);

const styles = StyleSheet.create({
  container: {
    marginTop: "50%",
    alignSelf: "center",
    width: CONTENT_SIDE,
    height: CONTENT_SIDE,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "70%",
    marginTop: "8%",
  },
  icon: {
    marginBottom: "8%",
  },
});

import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";
import { useLanguages } from "../../hooks";
import { icons, images } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";

const IMAGE_SIDE = widthPercentage(0.6);

const MyMomentsPlaceholder = ({ onPress }) => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView style={styles.container}>
      <Image style={styles.image} source={images.People} />

      <MainText style={styles.title} font="subtitle" align="center">
        {languageContent.placeholders.no_my_moments}
      </MainText>

      <SolidButton
        type="done"
        icon={icons.Add}
        onPress={onPress}
        style={styles.button}
        title={languageContent.buttons.create_moment}
      />
    </FadeAnimatedView>
  );
};

export default memo(MyMomentsPlaceholder);

const styles = StyleSheet.create({
  container: {
    marginTop: "45%",
    alignItems: "center",
  },
  image: {
    width: IMAGE_SIDE,
    height: IMAGE_SIDE * 0.7,
  },
  title: {
    marginTop: "8%",
    marginHorizontal: "8%",
  },
  button: {
    width: "60%",
    marginTop: "6%",
  },
});

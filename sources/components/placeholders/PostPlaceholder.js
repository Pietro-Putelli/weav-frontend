import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { MainText } from "../texts";

const IMAGE_SIDE = widthPercentage(0.28);

const PostPlaceholder = () => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView style={styles.container}>
      <Image
        coloredIcon
        side={IMAGE_SIDE}
        style={styles.image}
        source={icons.ColoredCamera}
      />

      <MainText
        uppercase
        style={styles.title}
        align={"center"}
        font="subtitle-2"
      >
        {languageContent.placeholders.no_posts}
      </MainText>
    </FadeAnimatedView>
  );
};

export default memo(PostPlaceholder);

const styles = StyleSheet.create({
  container: {
    padding: "6%",
    marginTop: "8%",
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    marginTop: "6%",
    marginHorizontal: "16%",
  },
  image: {
    width: IMAGE_SIDE,
    height: IMAGE_SIDE,
  },
});

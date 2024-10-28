import React from "react";
import { StyleSheet } from "react-native";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const ICON_SIDE = widthPercentage(0.2);

const AnonymousChatView = () => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView style={styles.container}>
      <SquareImage
        side={ICON_SIDE}
        source={icons.ColoredAnonymous}
        coloredIcon
      />

      <MainText font="subtitle" align="center" style={{ marginTop: "4%" }}>
        {languageContent.anonymous_chat}
      </MainText>
    </FadeAnimatedView>
  );
};

export default AnonymousChatView;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    marginHorizontal: "2%",
    marginVertical: "2%",
  },
});

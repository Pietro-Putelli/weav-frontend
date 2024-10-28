import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";
import { useLanguages } from "../../hooks";
import { PLACEHOLDER_HEIGHT, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { MainText } from "../texts";
import { SolidButton } from "../buttons";
import { icons } from "../../styles";
import { useNavigation } from "react-native-navigation-hooks";

const IMAGE_SIDE = widthPercentage(0.7);

const MyEventsPlaceholder = ({ style }) => {
  const { languageContent } = useLanguages();
  const navigation = useNavigation();

  return (
    <FadeAnimatedView style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={require("../../assets/images/event.png")}
      />

      <MainText style={styles.title} font="subtitle" align="center">
        {languageContent.placeholders.no_events_yet}
      </MainText>

      <SolidButton
        haptic
        style={{ marginTop: "6%" }}
        title="explore now"
        type="done"
        icon={icons.Cocktail}
        onPress={() => {
          navigation.pop();
        }}
      />
    </FadeAnimatedView>
  );
};

export default memo(MyEventsPlaceholder);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: PLACEHOLDER_HEIGHT,
  },
  image: {
    width: IMAGE_SIDE,
    height: IMAGE_SIDE * 0.6,
  },
  title: {
    marginTop: "8%",
    marginHorizontal: "10%",
  },
  button: {
    marginTop: "6%",
    width: "70%",
  },
});

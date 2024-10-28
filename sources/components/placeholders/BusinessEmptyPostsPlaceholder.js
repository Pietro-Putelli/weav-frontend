import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import { PLACEHOLDER_HEIGHT, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const CONTAINER_SIDE = widthPercentage(0.3);

const { width, height } = Dimensions.get("window");

const BusinessEmptyPostsPlaceholder = () => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView style={styles.container}>
      <SquareImage
        side={CONTAINER_SIDE}
        source={icons.ColoredCamera}
        coloredIcon
      />

      <View style={styles.content}>
        <MainText font="subtitle" align="center">
          {languageContent.placeholders.no_business_posts}
        </MainText>
      </View>

      <SolidButton
        style={{ width: "70%" }}
        title={languageContent.buttons.create_new_post}
        icon={icons.Add}
        type="done"
        onPress={() => {
          showStackModal({ screen: SCREENS.EditBusinessPost });
        }}
      />
    </FadeAnimatedView>
  );
};

export default memo(BusinessEmptyPostsPlaceholder);

const styles = StyleSheet.create({
  container: {
    height: PLACEHOLDER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    marginVertical: "6%",
    marginHorizontal: "8%",
  },
});

import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import {
  NAVIGATION_BAR_HEIGHT,
  PLACEHOLDER_HEIGHT,
  TAB_BAR_HEIGHT,
  widthPercentage,
} from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const IMAGE_SIDE = widthPercentage(0.35);

const { width, height } = Dimensions.get("window");

const ChatPlaceholder = ({ onPress, isBusiness }) => {
  const {
    languageContent: { placeholders, buttons },
  } = useLanguages();

  return (
    <FadeAnimatedView style={styles.container}>
      <SquareImage side={IMAGE_SIDE} source={icons.ColoredChat} coloredIcon />
      <MainText style={{ marginTop: "8%" }} align={"center"} font={"subtitle"}>
        {isBusiness ? placeholders.business_chats : placeholders.user_chats}
      </MainText>

      {!isBusiness && (
        <SolidButton
          type={"done"}
          onPress={onPress}
          icon={icons.Friends}
          style={{ marginTop: "4%" }}
          title={buttons.search_my_friends}
        />
      )}
    </FadeAnimatedView>
  );
};

export default ChatPlaceholder;

const styles = StyleSheet.create({
  container: {
    width,
    height: PLACEHOLDER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "6%",
  },
});

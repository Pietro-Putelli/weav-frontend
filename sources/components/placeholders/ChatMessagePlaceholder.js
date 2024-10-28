import React, { memo, useMemo } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { shareReaction } from "../../backend/chat";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { isNullOrEmptyObject } from "../../utility/boolean";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { ProfilePicture, SquareImage } from "../images";
import { MainText } from "../texts";

const CONTAINER_SIDE = widthPercentage(0.6);

const ChatMessagePlaceholder = ({ user, business }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const heyTitle = useMemo(() => {
    return "✌️ " + languageContent.buttons.send + " hey";
  }, []);

  /* Callback */

  const onReactionPress = () => {
    dispatch(shareReaction({ type: "HEY", receiver_id: user?.id }));
  };

  const containerStyle = useMemo(() => {
    return {
      ...styles.businessContainer,
      ...theme.styles.shadow_round,
    };
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        {!isNullOrEmptyObject(business) ? (
          <FadeAnimatedView style={styles.content}>
            <View style={containerStyle}>
              <SquareImage
                coloredIcon
                side={CONTAINER_SIDE / 3}
                source={icons.ColoredChat}
              />

              <MainText
                uppercase
                font="subtitle-1"
                align="center"
                style={{ marginTop: "10%" }}
              >
                {languageContent.placeholders.business_chat}
              </MainText>
            </View>
          </FadeAnimatedView>
        ) : (
          <FadeAnimatedView style={styles.content}>
            <ProfilePicture disabled source={user?.picture} />

            <View style={styles.titleContainer}>
              <MainText bold align="center" uppercase font="subtitle-2">
                {languageContent.placeholders.user_chat}
              </MainText>
            </View>

            <View style={{ marginTop: "4%" }}>
              <SolidButton
                loadingOnPress
                title={heyTitle}
                onPress={onReactionPress}
              />
            </View>
          </FadeAnimatedView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(ChatMessagePlaceholder);

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    marginTop: "4%",
    marginHorizontal: "12%",
  },
  businessContainer: {
    width: CONTAINER_SIDE * 1.2,
    height: CONTAINER_SIDE,
    justifyContent: "center",
    alignItems: "center",
    padding: "4%",
  },
});

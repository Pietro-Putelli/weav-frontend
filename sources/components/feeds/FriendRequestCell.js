import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import { typographies } from "../../styles";
import { BUTTON_HEIGHT, widthPercentage } from "../../styles/sizes";
import { SolidButton } from "../buttons";
import { ProfilePicture } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const NEW_BUTTON_HEIGHT = BUTTON_HEIGHT * 0.8;

const PROFILE_SIDE = widthPercentage(0.12);

const FriendRequestCell = ({ request, onPress, onActionPress }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { id, user } = request;

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.container,
    };
  }, []);

  const titleStyle = {
    fontSize: typographies.fontSizes.subtitle4,
  };

  return (
    <BounceView
      onPress={() => {
        onPress(user);
      }}
      style={containerStyle}
    >
      <View style={styles.userContainer}>
        <ProfilePicture disabled side={PROFILE_SIDE} source={user.picture} />
        <MainText style={{ flex: 1, marginHorizontal: "3%" }} font="subtitle">
          {user.username}
        </MainText>
      </View>

      <View style={styles.buttonsContainer}>
        <SolidButton
          flex
          style={styles.button}
          title="accept"
          type="done"
          marginRight
          loadingOnPress
          titleStyle={titleStyle}
          onPress={() => {
            onActionPress({ id, userId: user.id });
          }}
        />

        <SolidButton
          flex
          type="delete"
          style={styles.button}
          loadingOnPress
          title={languageContent.actions.ignore}
          titleStyle={titleStyle}
          onPress={() => {
            onActionPress({ id });
          }}
        />
      </View>
    </BounceView>
  );
};

export default memo(FriendRequestCell);

const styles = StyleSheet.create({
  container: {
    marginBottom: "3%",
    marginHorizontal: 6,
    paddingVertical: "3%",
    paddingHorizontal: "4%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonsContainer: {
    marginTop: "3%",
    flexDirection: "row",
    alignItems: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    height: NEW_BUTTON_HEIGHT,
  },
});

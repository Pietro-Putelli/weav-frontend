import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, useUser } from "../../hooks";
import { widthPercentage } from "../../styles/sizes";
import { ProfilePicture } from "../images";
import { MainText } from "../texts";

const REACTION_SIDE = widthPercentage(0.2);

const ReactionMessage = ({ message, receiver, isSender }) => {
  const theme = useTheme();

  const sender = useUser();

  const reactionUser = message.receiver == sender.id ? receiver : sender;

  return (
    <View style={styles.reaction_container}>
      <View>
        <ProfilePicture
          disabled
          side={REACTION_SIDE}
          disabledWithoutOpacity
          source={reactionUser?.picture}
        />
        <View
          style={[
            styles.reaction_title_container,
            {
              alignSelf: isSender ? "flex-end" : "flex-start",
              backgroundColor: theme.colors.main_accent,
            },
          ]}
        >
          <MainText bold font={"subtitle-3"}>
            ✌️HEY
          </MainText>
        </View>
      </View>
    </View>
  );
};

export default memo(ReactionMessage);

const styles = StyleSheet.create({
  reaction_container: {
    marginVertical: "4%",
  },
  reaction_title_container: {
    bottom: -8,
    padding: "5%",
    borderRadius: 12,
    paddingHorizontal: "8%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
  },
});

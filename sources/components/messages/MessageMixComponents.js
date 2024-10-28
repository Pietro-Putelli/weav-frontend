import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { getState } from "../../store/store";
import { ICON_SIZES } from "../../styles/sizes";
import { MainText } from "../texts";
import { BounceView, FadeView } from "../views";

const LOADER_SIDE = ICON_SIZES.three;

export const MessageLoader = memo(({ sent }) => {
  return (
    <FadeView hidden={sent} style={styles.message_loader_container}>
      <MainText font={"subtitle"}>Sending</MainText>
    </FadeView>
  );
});

export const ReplySegment = memo(({ isInput, isSender }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.reply_segment,
        {
          height: isInput ? "70%" : "100%",
          backgroundColor: isSender
            ? theme.white_alpha(0.6)
            : theme.colors.main_accent,
        },
      ]}
    />
  );
});

export const Username = memo(({ message }) => {
  const onPress = () => {};

  return (
    <BounceView onPress={onPress}>
      <MainText
        bold
        numberOfLines={1}
        font={"subtitle-1"}
        color={theme.colors.aqua}
        style={[{ marginBottom: 8 }]}
      >
        {message.sender.username}
      </MainText>
    </BounceView>
  );
});

export const ReplyUsername = memo(({ message, receiver, business }) => {
  const theme = useTheme();

  let { username, id } = getState("user").user;

  if (business && message.is_user) {
    username = business.name;
  } else if (message.sender == id && message.sender != message.reply.sender) {
    username = receiver.username;
  }

  return (
    <MainText
      bold
      numberOfLines={1}
      font={"subtitle-4"}
      color={theme.colors.aqua}
      style={[{ marginBottom: 4 }]}
    >
      {username}
    </MainText>
  );
});

const styles = StyleSheet.create({
  pulse_loader: {
    width: LOADER_SIDE,
    height: LOADER_SIDE,
  },
  reply_segment: {
    width: 2,
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 4,
  },
});

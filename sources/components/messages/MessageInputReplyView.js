import React, { memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { containsOnlyEmojis } from "../../utility/functions";
import { IconButton } from "../buttons";
import { MainText } from "../texts";
import { CollapseView } from "../views";
import { ReplySegment } from "./MessageMixComponents";

const REPLY_HEIGHT = RFPercentage(7);

const MessageInputReplyView = ({
  user,
  message,
  receiver,
  businessUser,
  onCancelPress,
}) => {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setCollapsed(message == undefined);
  }, [message]);

  const _onPress = () => {
    setTimeout(() => {
      onCancelPress();
    }, 300);
    setCollapsed(true);
  };

  const isSender =
    user.id == message?.sender?.id ||
    user.id == message?.sender ||
    message?.is_user;
  const containsEmojis = containsOnlyEmojis(message?.content);

  return (
    <CollapseView
      allowY
      height={REPLY_HEIGHT + 8}
      collapsed={collapsed}
      style={styles.container}
    >
      <View style={[theme.styles.shadow_round, styles.content]}>
        <ReplySegment isInput isSender={isSender} />

        <View style={{ flex: 1 }}>
          <MainText
            bold
            color={theme.colors.aqua}
            numberOfLines={1}
            font={"subtitle-2"}
            style={{ marginBottom: containsEmojis ? "0.5%" : "1.5%" }}
          >
            {isSender
              ? "You"
              : message?.sender?.username ||
                receiver?.username ||
                businessUser?.name}
          </MainText>

          <MainText font={"subtitle-2"} numberOfLines={1} style={styles.text}>
            {message?.content}
          </MainText>
        </View>

        <IconButton inset={4} source={icons.Cross} onPress={_onPress} />
      </View>
    </CollapseView>
  );
};
export default memo(MessageInputReplyView);

const styles = StyleSheet.create({
  container: {
    width: "96%",
    overflow: "hidden",
    flexDirection: "row",
    marginHorizontal: "2%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    height: REPLY_HEIGHT,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "4%",
    paddingLeft: "5%",
  },
  reply_segment: {
    width: 2,
    height: "65%",
    marginRight: 8,
    borderRadius: 4,
  },
  text: {
    marginLeft: "0.5%",
    marginRight: "2%",
  },
});

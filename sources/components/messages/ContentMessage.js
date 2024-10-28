import React, { memo, useMemo } from "react";
import { Text, View } from "react-native";
import Hyperlink from "react-native-hyperlink";
import { SCREENS } from "../../constants/screens";
import { useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { containsOnlyEmojis } from "../../utility/functions";
import { MainText } from "../texts";
import Username from "./Username";

const ContentMessage = memo(
  ({ message, isSender, isDiscussion, componentId }) => {
    const theme = useTheme();

    const { content } = message;

    const contentStyle = useMemo(
      () => ({
        ...theme.styles.shadow_round,
        backgroundColor: isSender
          ? theme.colors.third_background
          : theme.colors.second_background,
        padding: 14,
      }),
      [isSender]
    );

    const onHyperlinkPress = (url) => {
      pushNavigation({
        componentId,
        screen: SCREENS.Web,
        passProps: { url },
      });
    };

    if (containsOnlyEmojis(content)) {
      return <Text style={{ letterSpacing: 2, fontSize: 50 }}>{content}</Text>;
    }

    return (
      <View style={contentStyle}>
        {!isSender && isDiscussion && (
          <Username>{message.sender.username}</Username>
        )}
        <Hyperlink
          onPress={onHyperlinkPress}
          linkStyle={{ color: theme.colors.aqua }}
        >
          <MainText font="subtitle-2">{content}</MainText>
        </Hyperlink>
      </View>
    );
  }
);

export default memo(ContentMessage);

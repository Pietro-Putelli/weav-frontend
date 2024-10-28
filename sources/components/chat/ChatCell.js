import React, { memo, useCallback, useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { muteChat } from "../../handlers/chats";
import { useCurrentBusiness, useTheme } from "../../hooks";
import { getChatType } from "../../hooks/useChat";
import { icons } from "../../styles";
import { CHAT_CELL_HEIGHT } from "../../styles/sizes";
import { formatMessagePreview } from "../../utility/formatters";
import { OptionsSwipeableView } from "../gestures";
import { ProfilePicture, SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";
import BadgeMessageCount from "./BadgeMessageCount";
import SwipeableMenuContent from "./SwipeableMenuContent";

const { width } = Dimensions.get("window");
const X_LIMIT = width / 3;

const ChatCell = ({
  user,
  chat,
  states = {},
  onPress,
  onDeletePress,
  style,
}) => {
  const {
    messages,
    receiver,
    unread_count,
    muted,
    business,
    event,
    user: receiverBusiness,
  } = chat;

  const { selected, setSelected } = states;

  const isSelected = selected?.id == chat.id;

  const { isBusiness } = useCurrentBusiness();

  const theme = useTheme();
  const dispatch = useDispatch();
  const translateX = useSharedValue(0);

  /* Effects */

  useEffect(() => {
    const toValue = isSelected ? -X_LIMIT : 0;
    translateX.value = withSpring(toValue, { damping: 14 });
  }, [selected]);

  /* Props */

  const { picture, latestMessage, title, chatType } = useMemo(() => {
    const receiverUser = receiver ?? receiverBusiness;

    return {
      picture:
        receiverUser?.picture ??
        receiverBusiness?.picture ??
        business?.cover_source ??
        event?.cover,
      latestMessage: messages?.[0],
      title: receiverUser?.username ?? business?.name ?? event?.title,
      chatType: getChatType(chat),
    };
  }, [chat]);

  /* Callbacks */

  const onMutedPress = () => {
    setTimeout(() => {
      setSelected(undefined);
      dispatch(muteChat({ chat, isBusiness }));
    }, 200);
  };

  const onSwipe = useCallback(
    (mode) => {
      const item = mode == "half" ? chat : undefined;
      setSelected(item);
    },
    [chat]
  );

  const renderOptions = () => {
    return (
      <SwipeableMenuContent
        chat={chat}
        onMutedPress={onMutedPress}
        onDeletePress={onDeletePress}
      />
    );
  };

  return (
    <OptionsSwipeableView
      onSwipe={onSwipe}
      translateX={translateX}
      renderOptions={renderOptions}
    >
      <BounceView
        activeScale={0.98}
        disabled={isSelected}
        onPress={() => onPress(chat)}
        style={[styles.container, theme.styles.shadow_round, style]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ProfilePicture
            disabled
            side={CHAT_CELL_HEIGHT - 20}
            source={picture}
          />

          <View style={styles.content}>
            <View style={styles.chatUsernameContainer}>
              <MainText bold font="subtitle" numberOfLines={1}>
                {title}
              </MainText>
              {business && (
                <SquareImage
                  coloredIcon
                  style={{ marginLeft: 10 }}
                  source={icons.ColoredBusiness}
                  side={18}
                />
              )}
            </View>

            {latestMessage != undefined && (
              <MainText
                font="subtitle-1"
                numberOfLines={1}
                style={styles.latestMessage}
                color={theme.white_alpha(0.5)}
              >
                {formatMessagePreview({
                  message: latestMessage,
                  I: user,
                  chatType,
                })}
              </MainText>
            )}
          </View>

          <BadgeMessageCount muted={muted} count={unread_count} />
        </View>
      </BounceView>
    </OptionsSwipeableView>
  );
};
export default memo(ChatCell);

const styles = StyleSheet.create({
  container: {
    height: CHAT_CELL_HEIGHT,
    alignItems: "center",
    marginVertical: "1%",
    paddingHorizontal: "2%",
    marginHorizontal: "2%",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  latestMessage: {
    marginLeft: "1%",
    marginRight: "2%",
  },
  chatUsernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

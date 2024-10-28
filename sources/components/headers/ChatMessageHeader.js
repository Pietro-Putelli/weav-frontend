import { isUndefined } from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useCurrentBusiness, useTheme } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { deleteChatState } from "../../store/slices/chatsReducer";
import { icons, insets } from "../../styles";
import { CHAT_PROFILE_CELL_SIDE, ICON_SIZES } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { ProfilePicture } from "../images";
import { MainText } from "../texts";

const { width } = Dimensions.get("window");

const { MENU_MODAL } = actiontypes;

/* Use RECEIVER when it's necessary to create new chat */

const ChatMessageHeader = ({
  chat,
  receiver,
  business,
  isModal,
  popOnPress,
  componentId,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { isBusiness } = useCurrentBusiness();

  const businessChat = chat?.business ?? business;
  const userChat = chat?.receiver ?? receiver;
  const eventChat = chat?.event;

  const isBusinessChat = !isUndefined(businessChat) || !isUndefined(business);

  const isEventChat = !isUndefined(eventChat);

  const moreButtonVisible =
    !isUndefined(chat?.receiver) || !isUndefined(chat?.owner) || isEventChat;

  /* Callbacks */

  const onUserBlocked = useCallback(() => {
    navigation.popToRoot().then(() => {
      dispatch(deleteChatState(chat.id));
    });
  }, [chat]);

  /* Props */

  const picture = useMemo(() => {
    return (
      userChat?.picture ??
      business?.cover_source ??
      businessChat?.cover_source ??
      eventChat?.cover
    );
  }, [chat]);

  const title = useMemo(() => {
    return (
      userChat?.username ??
      chat?.name ??
      business?.name ??
      businessChat?.name ??
      eventChat?.title
    );
  }, [chat]);

  const isBusinssChatUserSide = useMemo(() => {
    return isBusinessChat && !isBusiness;
  }, [isBusinessChat]);

  const isEventDiscussionUserSide = isEventChat && !isBusiness;

  const theme = useTheme();

  const onTitlePress = () => {
    if (popOnPress) {
      navigation.pop();
      return;
    }

    if (isEventDiscussionUserSide) {
      pushNavigation({
        componentId,
        screen: SCREENS.EventDetail,
        passProps: { eventId: eventChat.id, popOnLeave: true },
      });
      return;
    }

    if (isBusinssChatUserSide) {
      pushNavigation({
        componentId,
        screen: SCREENS.VenueDetail,
        passProps: {
          initialBusiness: businessChat,
        },
      });
      return;
    }

    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user: userChat, isFromChat: true },
    });
  };

  return (
    <FadeAnimatedView
      mode="fade-up"
      style={[theme.styles.shadow_round, styles.container]}
    >
      <IconButton
        inset={5}
        side={ICON_SIZES.one}
        source={icons.Chevrons[isModal ? "Down" : "Left"]}
        onPress={() => {
          if (isModal) {
            navigation.dismissModal();
          } else {
            navigation.pop();
          }
        }}
      />

      <View style={styles.content}>
        <ProfilePicture
          disabled
          source={picture}
          side={CHAT_PROFILE_CELL_SIDE * 0.65}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={{ flex: 1 }}
          onPress={onTitlePress}
        >
          <MainText
            font="title-7"
            numberOfLines={1}
            style={{ marginLeft: "3%" }}
          >
            {title}
          </MainText>
        </TouchableOpacity>
      </View>

      {moreButtonVisible && (
        <IconButton
          inset={4}
          side={"one"}
          source={icons.More}
          onPress={() => {
            showSheetNavigation({
              screen: SCREENS.MenuModal,
              passProps: {
                type: isEventChat ? MENU_MODAL.DISCUSSION : MENU_MODAL.CHAT,
                chat,
                onUserBlocked,
              },
            });
          }}
        />
      )}
    </FadeAnimatedView>
  );
};

export default memo(ChatMessageHeader);

const styles = StyleSheet.create({
  container: {
    width,

    alignItems: "center",
    flexDirection: "row",
    paddingBottom: "2%",
    zIndex: 10,
    paddingHorizontal: "2%",
    paddingRight: "3%",
    paddingTop: insets.top,
    borderRadius: 0,
  },

  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "2%",
  },
});

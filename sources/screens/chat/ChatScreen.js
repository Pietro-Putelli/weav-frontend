import { isEmpty } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { IconButton } from "../../components/buttons";
import { ActivateNotificationsCell } from "../../components/cells";
import { ChatCell } from "../../components/chat";
import { HeaderFlatList } from "../../components/containers";
import { ChatPlaceholder } from "../../components/placeholders";
import { querylimits } from "../../constants/";
import { SCREENS } from "../../constants/screens";
import { deleteChat } from "../../handlers/chats";
import {
  useChats,
  useCurrentBusiness,
  useLanguages,
  useUser,
} from "../../hooks";
import { DoubleOptionPopupModal } from "../../modals";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";

const CHATS_LIMIT = querylimits.TWELVE;

const ChatScreen = ({ screenPaddingBottom, componentId }) => {
  /* States */

  const {
    chats,
    refreshChats,
    fetchChats,
    isLoading,
    isRefreshing,
    isNotFound,
  } = useChats();

  const { isBusiness } = useCurrentBusiness();
  const { hasNotificationPermission, ...user } = useUser();

  const { languageContent } = useLanguages();

  const [selected, setSelected] = useState();
  const [visiblePopup, setVisiblePopup] = useState(false);

  const offset = useRef(0);

  /* Utility hooks */

  const dispatch = useDispatch();

  const contentContainerStyle = useMemo(() => {
    if (isEmpty(chats)) {
      return { paddingBottom: 0 };
    }
    return {
      paddingBottom: screenPaddingBottom,
    };
  }, [chats, screenPaddingBottom]);

  /* Callbacks */

  const onRefresh = useCallback(() => {
    offset.current = 0;

    setSelected();
    refreshChats();
  }, [isBusiness]);

  const onEndReached = useCallback(() => {
    if (chats.length >= CHATS_LIMIT) {
      offset.current += CHATS_LIMIT;

      fetchChats(offset.current);
    }
  }, [chats]);

  const onSearchPress = () => {
    pushNavigation({
      screen: SCREENS.UserSearch,
      componentId,
    });
  };

  const onPressChat = useCallback((chat) => {
    pushNavigation({
      componentId,
      screen: SCREENS.ChatMessage,
      passProps: { chatId: chat.id },
    });

    setTimeout(() => {
      setSelected();
    }, 100);
  }, []);

  const onRemovePress = useCallback(() => {
    setVisiblePopup(true);
  }, []);

  const onDonePopupPress = useCallback(() => {
    setSelected();

    dispatch(deleteChat(selected));
  }, [selected]);

  const onPlaceholderPress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.UserSearch,
    });
  }, []);

  /* Props */

  const headerProps = useMemo(() => {
    return {
      title: languageContent.header_titles.conversations,
      noBack: true,
      rightComponent: isBusiness
        ? null
        : () => {
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconButton
                  inset={2}
                  source={icons.Search}
                  onPress={onSearchPress}
                />
              </View>
            );
          },
    };
  }, [languageContent, isBusiness]);

  /* Components */

  const renderItem = useCallback(
    ({ item: chat }) => {
      return (
        <ChatCell
          chat={chat}
          user={user}
          onPress={onPressChat}
          onDeletePress={onRemovePress}
          states={{ selected, setSelected }}
        />
      );
    },
    [user, selected]
  );

  const renderEmptyComponent = useCallback(() => {
    return (
      <ChatPlaceholder isBusiness={isBusiness} onPress={onPlaceholderPress} />
    );
  }, [isNotFound, isBusiness, onPlaceholderPress]);

  const renderHeader = useCallback(() => {
    if (hasNotificationPermission) {
      return null;
    }

    return <ActivateNotificationsCell />;
  }, [hasNotificationPermission]);

  return (
    <>
      <HeaderFlatList
        waitForData
        removeMargin
        data={chats}
        enabledAnimation
        onRefresh={onRefresh}
        isLoading={isLoading}
        isNotFound={isNotFound}
        bulkCount={CHATS_LIMIT}
        renderItem={renderItem}
        headerProps={headerProps}
        isRefreshing={isRefreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        renderHeader={renderHeader}
        renderEmptyComponent={renderEmptyComponent}
        contentContainerStyle={contentContainerStyle}
      />

      <DoubleOptionPopupModal
        visible={visiblePopup}
        setVisible={setVisiblePopup}
        onDonePress={onDonePopupPress}
        title={languageContent.popup_contents.delete_chat}
      />
    </>
  );
};

export default ChatScreen;

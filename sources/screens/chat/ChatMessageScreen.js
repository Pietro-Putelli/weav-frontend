import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { createBusinessChat, createUserChat } from "../../backend/chat";
import { BackToLastMessageButton } from "../../components/chat";
import { EdgeGesture } from "../../components/gestures";
import { ChatMessageHeader } from "../../components/headers";
import { ChatMessageList } from "../../components/lists";
import { MessageInputView, MessageTextView } from "../../components/messages";
import { socketactions } from "../../constants";
import querylimits from "../../constants/querylimits";
import {
  useChat,
  useLanguages,
  useMessages,
  useSharedWebSocket,
  useTheme,
  useUser,
} from "../../hooks";
import { CHAT_TYPES } from "../../hooks/useChat";
import { SinglePopupModal } from "../../modals";
import {
  appendChat,
  appendMessageAndCreateChat,
  appendMessageForChat,
  deleteChatState,
  updateMessageForChat,
  updateMessages,
} from "../../store/slices/chatsReducer";
import { isNullOrUndefined } from "../../utility/boolean";
import { count } from "../../utility/collections";
import { numberize } from "../../utility/functions";
import { removeAllNewEmptyLines } from "../../utility/strings";

const { width, height } = Dimensions.get("window");

const ChatMessageScreen = ({
  chatId,
  chatData,
  isModal,
  receiver,
  business,
  popOnPress,
  componentId,
}) => {
  /* Utility hooks */

  const theme = useTheme();
  const listRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const offset = useRef(0);
  const inputRef = useRef();

  /* States */

  let {
    chat,
    isChatActive,
    chatType,
    isBusinessChat,
    isDiscussionChat,
    isUserChat,
  } = useChat({ chatId, chatData, receiver, business });

  const chatDoesNotExist = isNullOrUndefined(chat);

  /* All chat messages */
  const { messages, fetchMessages } = useMessages({ chat, chatId });

  const user = useUser();
  const businessUser = chat?.business ?? business;

  /* Other states */

  const [isLoading, setIsLoading] = useState(false);
  const [visibleArrow, setVisibleArrow] = useState(false);
  const [isInvalidChat, setIsInvalidChat] = useState(false);

  /* Use when you create a chat, and let the user know the progress. */
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  /* Know if the business is currently typing */
  const isInputEnabled = (isChatActive && !isInvalidChat) || isDiscussionChat;

  /* Props */

  const isAnonymous = useMemo(() => {
    const lastMessages = messages.slice(-10);

    const isAnonymous = lastMessages.some((message) => {
      return message.is_anonymous;
    });

    return isAnonymous;
  }, [messages]);

  const listPlaceholderProps = useMemo(() => {
    return {
      user: receiver ?? chat?.receiver,
      business: businessUser ?? chat?.business,
    };
  }, [chat, receiver]);

  /* Socket Effects */

  const { sendMessage } = useSharedWebSocket(
    (data) => {
      let { action, content } = JSON.parse(data);

      if (action == socketactions.MESSAGE) {
        content = JSON.parse(content);

        let { message, temp_id: tempId } = content;
        message = JSON.parse(message);

        dispatch(updateMessageForChat({ chatId, tempId, message }));
      }

      if (action == socketactions.CHAT) {
        const { content: chat } = JSON.parse(data);

        dispatch(appendChat(chat));
      }

      refreshLayout();

      if (action == socketactions.CHAT_DOES_NOT_EXIST) {
        setTimeout(() => {
          setIsInvalidChat(true);
        }, 1000);
      }
    },
    [messages, isBusinessChat]
  );

  /* Methods */

  const createChatCallback = (chat) => {
    if (chat) {
      setIsCreatingChat(false);
      dispatch(appendChat(chat));
    }
  };

  const scrollToStart = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  /* Callbacks */

  const onSendMessage = (content) => {
    let message = {
      id: uuidv4(),
      sent: false,
      chat_id: numberize(chat?.id),
      content: removeAllNewEmptyLines(content),
      sender: user.id,
      chat_type: CHAT_TYPES.USER,
    };

    /* USER DISCUSSION */
    if (isDiscussionChat) {
      message.chat_type = CHAT_TYPES.DISCUSSION;
      message.discussion_id = message.chat_id;
      delete message.chat_id;
    }

    /* USER > USER */
    if (isUserChat) {
      const receiverId = chat?.receiver.id || receiver.id;
      message.receiver = receiverId;
    }

    /* USER > BUSINESS */
    if (isBusinessChat) {
      message.chat_type = CHAT_TYPES.BUSINESS;
    }

    /* If it's a discussion or a business, don't encrypt messages */
    if (isDiscussionChat) {
      sendMessage(message);

      dispatch(appendMessageForChat({ chatId, message }));
    } else {
      /* Encrypt message in case of USER chat */

      let newMessage = message;

      /* Chat does not exist, so create new one */
      if (chatDoesNotExist) {
        setIsCreatingChat(true);

        let chatData = newMessage;

        if (isBusinessChat) {
          const businessId = businessUser.id;

          chatData.business_id = businessId;

          createBusinessChat(chatData, createChatCallback);
        } else {
          createUserChat(chatData, (chat) => {
            if (chat) {
              createChatCallback(chat);
            }
          });
        }

        refreshLayout();

        return;
      }

      /* Send message via websocket only if the chat already exists */
      sendMessage(newMessage);

      if (isAnonymous) {
        dispatch(
          updateMessages({
            chatId,
            data: { is_anonymous: false },
          })
        );
      }

      refreshLayout();

      if (!receiver && !business) {
        dispatch(appendMessageForChat({ chatId, message }));
      } else {
        dispatch(appendMessageAndCreateChat({ chat, message }));
      }
    }
  };

  /* List callbacks */

  const onEndReached = useCallback(() => {
    if (count(messages) % querylimits.TEN != 0) {
      return;
    }

    setIsLoading(true);

    offset.current += 10;

    fetchMessages(offset.current, () => {
      setIsLoading(false);
    });
  }, [messages]);

  const onScroll = useCallback(({ contentOffset: { y } }) => {
    setVisibleArrow(Math.abs(y) >= height / 6);
  }, []);

  /* Remove no longer existing chat */

  const onRemoveChat = useCallback(() => {
    navigation.popToRoot().then(() => {
      dispatch(deleteChatState(chat.id));
    });
  }, []);

  /* Methods */

  const refreshLayout = () => {
    if (listRef.current?.prepareForLayoutAnimationRender) {
      // listRef.current?.prepareForLayoutAnimationRender();
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  /* Components */

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <MessageTextView
          message={item}
          chatType={chatType}
          business={businessUser}
          receiver={chat.receiver}
          componentId={componentId}
        />
      );
    },
    [messages, chat, businessUser]
  );

  return (
    <EdgeGesture
      disabled={!isModal}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ChatMessageHeader
        chat={chat}
        isModal={isModal}
        business={businessUser}
        popOnPress={popOnPress}
        componentId={componentId}
        receiver={receiver ?? chat?.user}
      />

      <ChatMessageList
        ref={listRef}
        isAnonymous={isAnonymous}
        onScroll={onScroll}
        messages={messages}
        isLoading={isLoading}
        renderItem={renderItem}
        onEndReached={onEndReached}
        isDiscussionChat={isDiscussionChat}
        placeholderProps={listPlaceholderProps}
      >
        <BackToLastMessageButton
          visible={visibleArrow}
          onPress={scrollToStart}
        />

        <MessageInputView
          ref={inputRef}
          isEnabled={isInputEnabled}
          isLoading={isCreatingChat}
          onSendMessage={onSendMessage}
        />
      </ChatMessageList>

      <SinglePopupModal
        visible={isInvalidChat}
        onDonePress={onRemoveChat}
        setVisible={setIsInvalidChat}
        title={languageContent.popup_contents.chat_does_not_exist}
      />
    </EdgeGesture>
  );
};
export default ChatMessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading_container: {
    width,
    marginTop: "4%",
    alignItems: "center",
  },
});

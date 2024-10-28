import _ from "lodash";
import { useState } from "react";
import { getMessagesForChat } from "../backend/chat";
import { getDiscussionMessages } from "../backend/discussions";
import { ChatEndpoints } from "../backend/endpoints";
import { CHAT_TYPES, getChatType } from "./useChat";

const { USER_MESSAGES, BUSINESS_MESSAGES } = ChatEndpoints;

const useMessages = ({ chat, chatId }) => {
  const [messages, setMessages] = useState();

  const chatType = getChatType(chat);
  const initialMessages = chat?.messages ?? [];

  const isBusinessChat = chatType == CHAT_TYPES.BUSINESS;
  const isDiscussionChat = chatType == CHAT_TYPES.DISCUSSION;

  let fetchMessages;

  if (isDiscussionChat) {
    fetchMessages = (offset, callback) => {
      getDiscussionMessages({ chatId: chat.id, offset }, (data) => {
        if (data) {
          const { messages } = data;

          setMessages((prevMessages) =>
            _.unionBy(prevMessages, messages, "id")
          );

          callback();
        }
      });
    };
  } else {
    fetchMessages = (offset, callback) => {
      const endpoint = isBusinessChat ? BUSINESS_MESSAGES : USER_MESSAGES;

      getMessagesForChat(
        { endpoint, chatId: chat?.id ?? chatId, offset },
        (messages) => {
          if (!messages) {
            return;
          }

          if (offset > 0) {
            setMessages((prevMessages) =>
              _.unionBy(prevMessages, messages, "id")
            );
          }
          callback?.();
        }
      );
    };
  }

  return {
    messages: _.unionBy(initialMessages, messages, "id"),
    fetchMessages,
  };
};

export default useMessages;

import { isUndefined } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatForBusiness,
  getChatForUser,
  readMessagesForBusinessChat,
  readMessagesForChat,
} from "../backend/chat";
import { getChatStateBy } from "../store/slices/chatsReducer";
import useCurrentBusiness from "./useCurrentBusiness";
import useDelayedEffect from "./useDelayedEffect";
import useUser from "./useUser";

/* Use chatData when the chat is not inside redux chats, like when you press the push notifcation */

const useChat = ({ chatId, chatData, receiver, business }) => {
  const receiverId = receiver?.id;
  const businessId = business?.id;

  /* States */
  const [chat, setChat] = useState(null);

  const selectedChat = useSelector((state) => {
    return getChatStateBy(state, { chatId, receiverId, businessId });
  });

  const chatType = getChatType(chat);

  const user = useUser();
  const { isBusiness } = useCurrentBusiness();

  const dispatch = useDispatch();

  /* 
     Use this to keep track the receiver response to message, 
     to avoid sending more than one message to new user.
  */

  const isChatActive = useMemo(() => {
    if (!chat) {
      return true;
    }

    const isActiveChat = chat.is_active;

    if (isActiveChat) {
      return true;
    }

    if (isUndefined(isActiveChat)) {
      return true;
    }

    const messages = chat?.messages;
    const lastMessage = messages?.[messages.length - 1];

    return lastMessage?.sender != user.id;
  }, [chat]);

  /* Easy use chat types */

  const { isBusinessChat, isUserChat, isDiscussionChat } = useMemo(() => {
    return {
      isBusinessChat: chatType == "business" || !isUndefined(businessId),
      isUserChat: chatType == "user" || !isUndefined(receiverId),
      isDiscussionChat: chatType == "discussion",
    };
  }, [chatType, receiverId, businessId]);

  const isBusinessUser = isBusinessChat && isBusiness;

  /* Get chat using receiverId */
  const _getChatForUser = () => {
    getChatForUser(receiverId, (chat) => {
      if (chat) {
        /* Exists, but not inside CHAT state, so download it. */
        setChat(chat);
      }
      /* Else the chat does not exist, write a message to create one */
    });
  };

  /* Get chat using businessId */
  const _getChatForBusiness = () => {
    getChatForBusiness(businessId, (chat) => {
      if (chat) {
        /* Exists, but not inside CHAT state, so download it. */
        setChat(chat);
      }
      /* Else the chat does not exist, write a message to create one */
    });
  };

  /* Props */

  const receiverPublicKey = useMemo(() => {
    if (chat && isUserChat) {
      return chat.receiver.public_key;
    }
    return receiver?.public_key;
  }, [chat, receiver, business]);

  /* Effects */

  useEffect(() => {
    if (selectedChat) {
      setChat(selectedChat);
    } else if (chatData) {
      setChat(chatData);
    } else if (receiverId) {
      _getChatForUser();
    } else if (businessId) {
      _getChatForBusiness();
    }
  }, [selectedChat, isUserChat, receiverPublicKey]);

  useDelayedEffect(
    400,
    () => {
      if (!chat || chat.unread_count == 0) {
        return;
      }

      const lastMessage = chat?.messages[0];

      if (lastMessage?.seen) {
        return;
      }

      if (isBusinessChat) {
        dispatch(
          readMessagesForBusinessChat({
            chat_id: chatId,
            is_user: !isBusinessUser,
          })
        );
      } else {
        dispatch(readMessagesForChat(chatId));
      }
    },
    [chat]
  );

  return {
    chat,
    chatType,
    isUserChat,
    isDiscussionChat,
    isBusinessChat,
    isBusinessUser,
    receiverPublicKey,
    isChatActive,
  };
};

export default useChat;

/* Utility */

export const CHAT_TYPES = {
  USER: "user",
  BUSINESS: "business",
  DISCUSSION: "discussion",
};

export const getChatType = (chat) => {
  if (chat?.id) {
    return chat?.id.split("_")[0];
  }
  return null;
};

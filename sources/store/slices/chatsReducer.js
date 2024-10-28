import { createSlice } from "@reduxjs/toolkit";
import _, { cloneDeep, merge, unionBy } from "lodash";
import { differenceUsingId, includesById } from "../../utility/collections";

const chatsReducer = createSlice({
  name: "chats",
  initialState: {
    chats: [],
  },
  reducers: {
    setChats(state, action) {
      const { data, mode } = action.payload;

      if (mode == "set") {
        state.chats = data;
      } else if (mode == "append-before") {
        state.chats = unionBy(data, state.chats, "id");
      } else {
        state.chats = unionBy(state.chats, data, "id");
      }
    },

    setChatBy(state, action) {
      const { chatId, data } = action.payload;

      const clone = _.cloneDeep(state.chats);
      const index = clone.findIndex((c) => c.id == chatId);

      if (index != -1) {
        clone[index] = {
          ...clone[index],
          ...data,
        };
      }
      state.chats = clone;
    },

    updateChat(state, action) {
      const { chatId, data } = action.payload;

      const chats = _.cloneDeep(state.chats);
      const index = chats.findIndex((c) => c.id == chatId);

      if (index != -1) {
        const currentChat = chats[index];
        state.chats[index] = {
          ...currentChat,
          ...data,
        };
      }
    },

    /* Edit single messages and move the chat to the first position */
    updateMessageForChat(state, action) {
      const { chatId, tempId, message } = action.payload;

      let chats = _.cloneDeep(state.chats);
      const index = chats.findIndex((c) => c.id == chatId);
      const currentChat = chats[index];

      if (index != -1) {
        const msgIndex = currentChat.messages.findIndex((m) => m.id == tempId);

        if (msgIndex != -1) {
          currentChat.messages[msgIndex] = message;

          chats = chats.filter((chat) => chat.id != currentChat.id);
          chats.unshift(currentChat);

          state.chats = chats;
        }
      }
    },

    updateMessages: (state, action) => {
      const { chatId, data } = action.payload;

      const index = state.chats.findIndex((c) => c.id == chatId);

      if (index != -1) {
        state.chats[index].messages.map((message) => {
          return merge(message, data);
        });
      }
    },

    /* Append message to the first position, use when sending */
    appendMessageForChat(state, action) {
      const { chatId, message } = action.payload;

      const index = state.chats.findIndex((c) => c.id == chatId);

      state.chats[index].messages = unionBy(
        [message],
        state.chats[index]?.messages ?? [],
        "id"
      );
    },

    /* Append new message to new created chat */
    appendMessageAndCreateChat(state, action) {
      const { chat, message } = action.payload;

      const chats = _.cloneDeep(state.chats);
      const newChat = _.cloneDeep(chat);

      if (
        !includesById(chats, newChat) ||
        (chats.length > 0 && chats[0].id != newChat.id)
      ) {
        newChat.messages.unshift(message);
        chats.unshift(newChat);
      } else {
        chats[0].messages.unshift(message);
      }

      state.chats = chats;
    },

    /* Set all messages as read when push in ChatMessageScreen */
    setMessagesAsRead(state, action) {
      const clone = _.cloneDeep(state.chats);
      const index = clone.findIndex((c) => c.id == action.payload);

      if (index != -1) {
        state.chats[index].unread_count = 0;
        state.chats[index].messages = state.chats[index].messages.map(
          (message) => {
            return { ...message, seen: true };
          }
        );
      }
    },

    /* Use this in ChatScreen socket onmessage received to update chat or message */
    appendChat(state, action) {
      const chat = action.payload;

      let chats = cloneDeep(state.chats);

      chats = chats.filter((c) => c?.id != chat.id);
      chats.unshift(chat);

      state.chats = chats;
    },

    appendChats(state, action) {
      let chats = _.cloneDeep(state.chats);
      chats = differenceUsingId(chats, action.payload);
      state.chats = [action.payload, chats].flat();
    },

    deleteChatState(state, action) {
      state.chats = _.cloneDeep(state.chats).filter(
        (chat) => chat.id != action.payload
      );
    },

    removeEventChat: (state, action) => {
      const eventId = action.payload;

      state.chats = state.chats.filter((chat) => {
        return chat?.event?.id != eventId;
      });
    },
  },
});

export const {
  setChats,
  updateChat,
  appendChat,
  updateMessages,
  deleteChatState,
  updateMessageForChat,
  appendMessageForChat,
  appendMessageAndCreateChat,
  setMessagesAsRead,
  appendChats,
  removeEventChat,
} = chatsReducer.actions;

export const getChatsState = (state) => {
  return state.chats.chats;
};

export const getChatStateBy = (state, { chatId, receiverId, businessId }) => {
  return unionBy(state.chats.chats, state.cache.chats, "id").filter((chat) => {
    const { id, receiver, business } = chat;

    return (
      (chatId && id == chatId) ||
      (receiverId && receiver?.id == receiverId) ||
      (businessId && business?.id == businessId)
    );
  })?.[0];
};

export const getUnreadChatCount = (state) => {
  return state.chats.chats.filter((chat) => chat.unread_count > 0).length;
};

export default chatsReducer.reducer;

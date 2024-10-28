import _ from "lodash";
import { CHAT_TYPES } from "../hooks/useChat";
import {
  appendChats,
  deleteChatState,
  setMessagesAsRead,
  updateChat,
} from "../store/slices/chatsReducer";
import { updateMomentState } from "../store/slices/momentsReducer";
import { numberize } from "../utility/functions";
import { ChatEndpoints } from "./endpoints";
import {
  deleteWithAuth,
  getWithAuth,
  postWithAuth,
  putWithAuth,
} from "./methods";

const {
  CHAT,
  CHAT_USER_ID,
  READ_MESSAGES,
  MUTE,
  SEARCH_CHATS,

  SHARE_MOMENT,
  SHARE_PROFILE,
  SHARE_REACTION,

  BUSINESS_CHAT_CREATE,
  BUSINESS_CHAT_GET,
  BUSINESS_CHAT_ID,
  BUSINESS_READ_MESSAGES,
} = ChatEndpoints;

/* Get user chats and clubs order by update_at */
export const getChats = (offset, callback) => {
  getWithAuth(CHAT, { offset })
    .then(({ data }) => {
      callback?.(data);
    })
    .catch((e) => {
      callback?.();
      console.log("[get-chats]", e);
    });
};

/* Get chat's messages */
export const getMessagesForChat = ({ chatId, endpoint, offset }, callback) => {
  getWithAuth(endpoint, { chat_id: numberize(chatId), offset })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback?.();
      console.log("[get-chat-messages]", e);
    });
};

export const getChatForUser = (userId, callback) => {
  getWithAuth(CHAT_USER_ID, { user_id: userId })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback();
      console.log("[get-chat-user]", e);
    });
};

export const readMessagesForChat = (chatId) => (dispatch) => {
  getWithAuth(READ_MESSAGES, { chat_id: numberize(chatId) })
    .then(() => {
      dispatch(setMessagesAsRead(chatId));
    })
    .catch((e) => {
      console.log("[read-messages]", e);
    });
};

export const muteChatById =
  ({ chat, type, isBusiness }, callback) =>
  (dispatch) => {
    const chatId = chat?.id;

    let options = { type, id: numberize(chatId) };

    if (type == CHAT_TYPES.BUSINESS) {
      options.is_business = isBusiness;
    }

    putWithAuth(MUTE, options)
      .then(() => {
        dispatch(updateChat({ chatId, data: { muted: !chat?.muted } }));
        callback?.();
      })
      .catch((e) => {
        console.log("[mute-chat]", e);
      });
  };

/* Use APIView to delete chat */
export const deleteChatById =
  ({ id, type }) =>
  (dispatch) => {
    deleteWithAuth(CHAT, { id: numberize(id), type })
      .then(() => {
        dispatch(deleteChatState(id));
      })
      .catch((e) => {
        console.log("[chat-delete]", e);
      });
  };

/* Use to create chat with starting by one message response_data: {message,chat} */
export const createUserChat = (data, callback) => {
  postWithAuth(CHAT, data)
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(null);
      console.log("[create-chat-error]", e);
    });
};

export const searchMyChats = (options, callback) => {
  getWithAuth(SEARCH_CHATS, options)
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback();
      console.log("[search-my-chat]", e);
    });
};

/* BUSINESS */

export const getChatForBusiness = (business_id, callback) => {
  getWithAuth(BUSINESS_CHAT_ID, { business_id })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback();
      console.log("[get-chat-for-business]", e);
    });
};

export const createBusinessChat = (data, callback) => {
  postWithAuth(BUSINESS_CHAT_CREATE, _.pick(data, ["content", "business_id"]))
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback(null);
      console.log("[create-business-chat]", e);
    });
};

export const getBusinessChats = (params, callback) => {
  getWithAuth(BUSINESS_CHAT_GET, params)
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      callback();
      console.log("[get-business-chats]", e);
    });
};

export const readMessagesForBusinessChat =
  ({ chat_id, is_user }) =>
  (dispatch) => {
    getWithAuth(BUSINESS_READ_MESSAGES, {
      chat_id: numberize(chat_id),
      is_user,
    })
      .then(() => {
        dispatch(setMessagesAsRead(chat_id));
      })
      .catch((e) => {
        console.log("[read-messages-for-business-chat]", e);
      });
  };

/* HANDLE SHARE ITEMS */

/* { moment_id (for user) , moment_slice_id (for business)  , receivers : [] } */
export const shareMoment = (data, callback) => (dispatch) => {
  postWithAuth(SHARE_MOMENT, data)
    .then(({ data }) => {
      callback(true);
      dispatch(appendChats(data));
    })
    .catch((e) => {
      callback(false);
      console.log("[share-moment]", e);
    });
};

/* { mode : { "user" , "business" } , profile_id , receivers : [] } */
export const shareProfile = (data, callback) => (dispatch) => {
  postWithAuth(SHARE_PROFILE, data)
    .then(({ data }) => {
      dispatch(appendChats(data));
      callback(true);
    })
    .catch((e) => {
      callback(false);
      console.log("[share-profile]", e);
    });
};

/* type : { "emojie" , "hey" } , content , moment_id  */
export const shareReaction = (data, callback) => (dispatch) => {
  const momentId = data?.moment_id;

  postWithAuth(SHARE_REACTION, data)
    .then(({ data: chat }) => {
      if (chat) {
        /* The chat can be null, because the message can be anonymous */
        dispatch(appendChats([chat]));
      }

      dispatch(updateMomentState({ momentId, data: { replied: true } }));

      callback?.(true);
    })
    .catch((e) => {
      callback?.(null);
      console.log("[share-reaction]", e);
    });
};

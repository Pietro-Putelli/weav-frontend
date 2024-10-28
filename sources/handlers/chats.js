import { deleteChatById, muteChatById } from "../backend/chat";
import { deleteDiscussion, muteDiscussion } from "../backend/discussions";
import { CHAT_TYPES, getChatType } from "../hooks/useChat";

/* Handle mute action both for chats and discussions */
export const muteChat =
  ({ chat, isBusiness }, callback) =>
  (dispatch) => {
    const type = getChatType(chat);

    if (type == CHAT_TYPES.DISCUSSION) {
      dispatch(muteDiscussion(chat));
    } else {
      dispatch(muteChatById({ chat, type, isBusiness }));
    }

    callback?.();
  };

/* Handle delete action both for chat and discussion */
export const deleteChat = (chat) => (dispatch) => {
  const type = getChatType(chat);

  const chatId = chat?.id;
  const eventId = chat?.event?.id;

  if (type == CHAT_TYPES.DISCUSSION) {
    dispatch(deleteDiscussion({ chatId, eventId }));
  } else {
    dispatch(deleteChatById({ id: chatId, type }));
  }
};

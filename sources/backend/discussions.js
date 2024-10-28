import { deleteChatState, updateChat } from "../store/slices/chatsReducer";
import { updateEventState } from "../store/slices/eventsReducer";
import { numberize } from "../utility/functions";
import { DiscussionEndpoints } from "./endpoints";
import { deleteWithAuth, getWithAuth, putWithAuth } from "./methods";

const { MUTE, DELETE, MESSAGES } = DiscussionEndpoints;

export const muteDiscussion = (chat, callback) => (dispatch) => {
  const chatId = chat?.id;

  putWithAuth(MUTE, { id: numberize(chatId) })
    .then(() => {
      dispatch(updateChat({ chatId, data: { muted: !chat?.muted } }));
      callback?.(true);
    })
    .catch((error) => {
      callback?.(false);
      console.log("[mute-discussion]", error);
    });
};

export const deleteDiscussion =
  ({ chatId, eventId }) =>
  (dispatch) => {
    deleteWithAuth(DELETE, { id: numberize(chatId) })
      .then(() => {
        dispatch(deleteChatState(chatId));
        dispatch(updateEventState({ eventId, data: { is_going: false } }));
      })
      .catch((error) => {
        console.log("[delete-discussion]", error);
      });
  };

export const getDiscussionMessages = ({ chatId, offset }, callback) => {
  getWithAuth(MESSAGES, { offset, id: numberize(chatId) })
    .then(callback)
    .catch((error) => {
      callback(null);
      console.log("[get-discussion-messages]", error);
    });
};

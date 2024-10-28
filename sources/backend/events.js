import { appendChat } from "../store/slices/chatsReducer";
import {
  appendBusinessEventsState,
  removeBusinessEventSliceState,
  removeBusinessEventState,
  setBusinessEventsState,
  setEventsState,
  updateBusinessEventsState,
  updateEventState,
} from "../store/slices/eventsReducer";
import { EventEndpoints } from "./endpoints";
import {
  deleteWithAuth,
  getUsingUserPositionData,
  getWithAuth,
  postFormDataWithAuth,
  putFormDataWithAuth,
  putWithAuth,
} from "./methods";

const {
  ROOT_EVENT,
  GET_EVENTS,
  GET_EVENT_DETAIL,
  GET_EVENT_PARTICIPANTS,
  GET_MY_EVENTS,
  PUT_USER_GOING,
} = EventEndpoints;

class EventsAPI {
  static get = (offset, callback) => (dispatch) => {
    const mode = offset == 0 ? "set" : "append";

    getUsingUserPositionData(GET_EVENTS, { offset }, { coordinate: true })
      .then(({ data }) => {
        dispatch(setEventsState({ data, mode }));

        callback?.(true);
      })
      .catch((e) => {
        callback?.();
        console.log("[get-moments]:", e);
      });
  };

  static createOrUpdate =
    ({ data, isEditing }, callback) =>
    (dispatch) => {
      (isEditing ? putFormDataWithAuth : postFormDataWithAuth)(ROOT_EVENT, data)
        .then(({ data }) => {
          if (isEditing) {
            dispatch(updateBusinessEventsState({ data, eventId: data.id }));
          } else {
            dispatch(appendBusinessEventsState(data));
          }

          callback({ isDone: true });
        })
        .catch((error) => {
          const status = error.response?.status;

          if (status == 406) {
            callback({ isInvalid: true });
            return;
          }

          callback({ isInvalid: false });
          console.log("[create-event]", error);
        });
    };

  static getDetail = (eventId, callback) => {
    getWithAuth(GET_EVENT_DETAIL, { eventId })
      .then(({ data }) => {
        callback?.(data);
      })
      .catch((error) => {
        callback(null);
        console.log("[get-event-moment-detail]:", error);
      });
  };

  static getParticipants = ({ eventId, offset, limit }, callback) => {
    getWithAuth(GET_EVENT_PARTICIPANTS, { eventId, offset, limit })
      .then(({ data }) => {
        callback(data);
      })
      .catch((error) => {
        callback(false);
        console.log("[get-event-moment-participants]", error);
      });
  };

  static getMine = (params, callback) => {
    getUsingUserPositionData(GET_MY_EVENTS, params, { coordinate: true })
      .then(callback)
      .catch((errror) => {
        callback(false);
        console.log("[get-my-events]", errror);
      });
  };

  static userParticipate = (eventId, callback) => (dispatch) => {
    putWithAuth(PUT_USER_GOING, { id: eventId })
      .then(({ data }) => {
        const { is_going, discussion } = data;

        dispatch(updateEventState({ eventId, data: { is_going } }));

        if (is_going) {
          dispatch(appendChat(discussion));
          callback("add");
        } else {
          callback("remove");
        }
      })
      .catch((error) => {
        callback(null);
        console.log("[user-going-to-event]", error);
      });
  };

  static getBusinessEvents = (callback) => (dispatch) => {
    getWithAuth(ROOT_EVENT)
      .then(({ data }) => {
        dispatch(setBusinessEventsState(data));

        callback?.(true);
      })
      .catch((error) => {
        callback?.();
        console.log("[get-business-events]:", error);
      });
  };

  static deleteBusinessEvent = (eventId, callback) => (dispatch) => {
    deleteWithAuth(ROOT_EVENT, { eventId })
      .then(() => {
        dispatch(removeBusinessEventState(eventId));

        callback?.(true);
      })
      .catch((e) => {
        console.log("[delete-event-moment]", e);
        callback?.(false);
      });
  };

  static deleteBusinessEventSlice =
    ({ eventId, sliceId }) =>
    (dispatch) => {
      deleteWithAuth(ROOT_EVENT, { eventId, sliceId })
        .then(() => {
          dispatch(removeBusinessEventSliceState({ eventId, sliceId }));

          callback?.(true);
        })
        .catch((e) => {
          console.log("[delete-event-moment]", e);
          callback?.(false);
        });
    };
}

export default EventsAPI;

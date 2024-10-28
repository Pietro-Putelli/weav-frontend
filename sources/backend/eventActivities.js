import {
  setCurrentActivityEvent,
  setCurrentActivityEventParticipants,
} from "../store/slices/eventActivitesReducer";
import { EventActivityEndpoints } from "./endpoints";
import {
  getWithAuth,
  postWithAuth,
  postWithAuthUsingPosition,
  postWithUserAuth,
} from "./methods";

const {
  GET__CURRENT,
  GET__PARTICIPANTS,
  POST__MEMBERSHIP,
  MATCH__ACCEPT,
  MATCH__CREATE,
  MATCH__SKIP,
  MATCH__COMPLETE,
} = EventActivityEndpoints;

class EventActivitiesAPI {
  static getParticipants = (eventId, callback) => (dispatch) => {
    getWithAuth(GET__PARTICIPANTS, { eventId })
      .then(({ data }) => {
        if (data) {
          dispatch(setCurrentActivityEventParticipants(data));
        }
        callback?.(true);
      })
      .catch((e) => {
        callback?.(false);
        console.log("[EventActivitiesAPI] getParticipants error", e);
      });
  };

  static handleMembership = ({ eventId, mode }, callback) => {
    postWithAuth(POST__MEMBERSHIP, { eventId, mode })
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback?.(false);
        console.log("[EventActivitiesAPI] handleMembership error", e);
      });
  };

  static createMatch = (eventId, callback) => {
    postWithUserAuth(MATCH__CREATE, { eventId })
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback?.(false);
        console.log("[EventActivitiesAPI] createMatch error", e);
      });
  };

  static acceptMatch = ({ matchId }, callback) => {
    postWithUserAuth(MATCH__ACCEPT, { matchId })
      .then(({ data }) => {
        callback?.(data);
      })
      .catch((e) => {
        callback?.(false);
        console.log("[EventActivitiesAPI] acceptMatch error", e);
      });
  };

  static skipMatch = ({ matchId }, callback) => {
    postWithAuth(MATCH__SKIP, { matchId })
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback?.(false);
        console.log("[EventActivitiesAPI] skipMatch error", e);
      });
  };

  /* Used by business owner to verify QR Code that contains matchToken */
  static completeMatch = ({ matchId, matchToken }, callback) => {
    postWithAuth(MATCH__COMPLETE, { matchId, matchToken })
      .then(() => {
        callback(true);
      })
      .catch((e) => {
        callback(false);
        console.log("[EventActivitiesAPI] completeMatch error", e);
      });
  };

  /* Get current event in 100 meters or radius */
  static getCurrentEvent = (callback) => (dispatch) => {
    postWithAuthUsingPosition(GET__CURRENT)
      .then(({ data }) => {
        console.log(data);
        callback?.(true);
        dispatch(setCurrentActivityEvent(data));
      })
      .catch((e) => {
        callback?.(false);
        console.log("[EventActivitiesAPI] getCurrentEvent error", e);
      });
  };
}

export default EventActivitiesAPI;

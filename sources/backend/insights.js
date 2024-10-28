import { updateBusinessEventInsights } from "../store/slices/eventsReducer";
import { InsightsEndpoints } from "./endpoints";
import { getWithAuth } from "./methods";

const { OVERVIEW, DETAILS, EVENT } = InsightsEndpoints;

class InsightsAPI {
  static getOverview = (params, callback) => {
    getWithAuth(OVERVIEW, params)
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback(null);
        console.log("[get-overview-insights]", e);
      });
  };

  static getDetails = (params, callback) => {
    getWithAuth(DETAILS, params)
      .then(({ data }) => {
        callback(data);
      })
      .catch((e) => {
        callback(null);
        console.log("[get-repost-insights]", e);
      });
  };

  static getEvent = (eventId, callback) => (dispatch) => {
    getWithAuth(EVENT, { eventId })
      .then(({ data }) => {
        dispatch(updateBusinessEventInsights({ data, eventId }));
        callback?.(true);
      })
      .catch((e) => {
        callback?.(false);
        console.log("[event-insights]", e);
      });
  };
}

export default InsightsAPI;

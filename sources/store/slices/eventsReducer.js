import { createSlice } from "@reduxjs/toolkit";
import { findIndex, orderBy, unionBy } from "lodash";

const eventsReducer = createSlice({
  name: "events",
  initialState: {
    /* List of events in city */
    events: [],

    /* Events loaded through other screens */
    cachedEvents: [],

    /* Events I partecipate */
    myEvents: [],

    /* My events as business */
    myBusinessEvents: [],
  },
  reducers: {
    /* events */

    setEventsState: (state, action) => {
      const { data, mode } = action.payload;

      if (mode == "set") {
        state.events = data;
      } else {
        state.events = unionBy(state.events, data, "id");
      }
    },

    setEventDetailState: (state, action) => {
      const { data, eventId } = action.payload;

      const index = findIndex(state.events, ["id", eventId]);

      if (index != -1) {
        state.events[index] = {
          ...state.events[index],
          ...data,
          has_detail: true,
        };
      }
    },

    updateEventState: (state, action) => {
      const { data, eventId } = action.payload;

      const index = findIndex(state.events, ["id", eventId]);

      if (index != -1) {
        state.events[index] = { ...state.events[index], ...data };
      }
    },

    /* cachedEvents */

    updateCachedEventsState: (state, action) => {
      state.cachedEvents = unionBy(state.cachedEvents, [action.payload], "id");
    },

    /* myEvents */

    setMyEventsState: (state, action) => {
      state.myEvents = action.payload;
    },

    addMyEventState: (state, action) => {
      const event = action.payload;

      const index = findIndex(state.events, ["id", event.id]);

      if (index != -1) {
        state.events[index].participants_count += 1;
        event.is_going = true;

        state.myEvents = unionBy(state.myEvents, [event], "id");
      }

      // put periodical events at the start

      const periodicEvents = state.myEvents.filter((event) => {
        return event?.periodic_day;
      });

      const orderedEvents = state.myEvents
        .filter((event) => {
          return !event?.periodic_day;
        })
        .sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

      state.myEvents = unionBy(orderedEvents, periodicEvents, "id");
    },

    removeMyEventState: (state, action) => {
      const eventId = action.payload;

      const index = findIndex(state.events, ["id", eventId]);

      if (index != -1) {
        state.events[index].participants_count -= 1;
      }

      state.myEvents = state.myEvents.filter((event) => {
        return event.id != eventId;
      });
    },

    /* myBusinessEvents */

    setBusinessEventsState: (state, action) => {
      state.myBusinessEvents = action.payload;
    },

    appendBusinessEventsState: (state, action) => {
      state.myBusinessEvents = unionBy(
        state.myBusinessEvents,
        [action.payload],
        "id"
      );
    },

    updateBusinessEventsState: (state, action) => {
      const { data, eventId } = action.payload;

      const index = findIndex(state.myBusinessEvents, ["id", eventId]);

      if (index != -1) {
        state.myBusinessEvents[index] = {
          ...state.myBusinessEvents[index],
          ...data,
        };
      }
    },

    removeBusinessEventState: (state, action) => {
      const eventId = action.payload;

      state.myBusinessEvents = state.myBusinessEvents.filter((event) => {
        return event.id != eventId;
      });
    },

    removeBusinessEventSliceState: (state, action) => {
      const { eventId, sliceId } = action.payload;

      const index = findIndex(state.myBusinessEvents, ["id", eventId]);

      if (index != -1) {
        state.myBusinessEvents[index].slices = state.myBusinessEvents[
          index
        ].slices.filter((slice) => {
          return slice.id != sliceId;
        });
      }
    },

    updateBusinessEventDetails: (state, action) => {
      const { eventId, data } = action.payload;

      const index = findIndex(state.myBusinessEvents, ["id", eventId]);

      if (index != -1) {
        state.myBusinessEvents[index] = {
          ...state.myBusinessEvents[index],
          ...data,
          hasDetails: true,
        };
      }
    },

    updateBusinessEventInsights: (state, action) => {
      const { eventId, data } = action.payload;

      const index = findIndex(state.myBusinessEvents, ["id", eventId]);

      if (index != -1) {
        state.myBusinessEvents[index].insights = {
          ...state.myBusinessEvents[index].insights,
          ...data,
        };
      }
    },

    addRepostToEvent: (state, action) => {
      const eventId = action.payload;

      const events = unionBy(state.events, state.cachedEvents, "id");

      const index = findIndex(events, ["id", eventId]);

      if (index != -1) {
        events[index].reposts_count += 1;
      }
    },

    clearEventsState: (state) => {
      state.events = [];
      state.cachedEvents = [];
      state.myEvents = [];
      state.myBusinessEvents = [];
    },
  },
});

export const {
  setEventsState,
  setEventDetailState,
  updateEventState,
  updateCachedEventsState,
  setMyEventsState,
  addMyEventState,
  removeMyEventState,

  addRepostToEvent,

  setBusinessEventsState,
  appendBusinessEventsState,
  updateBusinessEventsState,
  removeBusinessEventState,
  removeBusinessEventSliceState,

  updateBusinessEventDetails,
  updateBusinessEventInsights,

  clearEventsState,
} = eventsReducer.actions;

export const getEventsState = (state) => {
  return state.events.events;
};

export const getEventByIdState = (state, eventId) => {
  const { events, cachedEvents } = state.events;

  return unionBy(events, cachedEvents, "id").filter((event) => {
    return event.id === eventId;
  })?.[0];
};

export const getMyEventsState = (state) => {
  return state.events.myEvents;
};

export const getMyBusinessEventByIdState = (state, eventId) => {
  return state.events.myBusinessEvents.filter((event) => {
    return event.id == eventId;
  })?.[0];
};

export const getMyBusinessEventsState = (state) => {
  return state.events.myBusinessEvents;
};

export default eventsReducer.reducer;

import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { MatchStates } from "../../constants";

const eventActivitesReducer = createSlice({
  name: "eventActivities",
  initialState: {
    event: null,

    participants: [],
    participantsCount: 0,

    match: null,
    matchState: MatchStates.New,
    matchAcceptedAt: null,
  },
  reducers: {
    setCurrentActivityEvent: (state, action) => {
      const payload = action.payload;

      if (payload?.participants) {
        const { participants, participants_count } = payload;

        delete payload.participants;
        delete payload.participants_count;

        state.participants = participants;
        state.participantsCount = participants_count;
      }

      state.event = payload;

      if (!payload) {
        state.participants = [];
        state.participantsCount = 0;
        state.match = null;
        state.matchState = MatchStates.New;
        state.matchAcceptedAt = null;
      }
    },

    setCurrentActivityEventParticipants: (state, action) => {
      const { users, count } = action.payload;

      state.participants = users;
      state.participantsCount = count;
    },

    setActivityEventMatch: (state, action) => {
      const match = action.payload;

      if (state.match?.id != match?.id) {
        state.matchAcceptedAt = null;
      }

      state.match = match;

      if (state.matchState == MatchStates.WaitingForMatch) {
        state.matchState = MatchStates.WaitigForAccept;
      }

      if (match == null) {
        state.matchState = MatchStates.New;
        state.matchAcceptedAt = null;
      }
    },

    setActivityEventMatchState: (state, action) => {
      const payload = action.payload;

      const matchState = payload?.matchState ?? payload;
      const event = payload?.event;

      state.matchState = matchState;

      if (event) {
        state.event = event;
      }

      if (matchState == MatchStates.Rejected) {
        state.matchState = MatchStates.New;
        state.matchAcceptedAt = null;
      }
    },

    setActivityEventMatchAcceptedAt: (state, _) => {
      state.matchAcceptedAt = moment();
    },
  },
});

export const {
  setCurrentActivityEvent,
  setCurrentActivityEventParticipants,
  setActivityEventMatch,
  setActivityEventMatchState,
  setActivityEventMatchAcceptedAt,
} = eventActivitesReducer.actions;

export default eventActivitesReducer.reducer;

export const getCurrentActivityEvent = (state) => {
  return state.eventActivities.event;
};

const getParticipants = (state) => {
  return state.eventActivities.participants;
};

const getParticipantsCount = (state) => {
  return state.eventActivities.participantsCount;
};

export const getCurrentActivityEventParticipants = createSelector(
  [getParticipants, getParticipantsCount],
  (participants, participantsCount) => {
    return { participants, participantsCount };
  }
);

export const getCurrentEventUserMatch = (state) => {
  return state.eventActivities.match;
};

export const getCurrentEventUserMatchState = (state) => {
  return state.eventActivities.matchState;
};

export const getCurrentEventUserMatchAcceptedAt = (state) => {
  return state.eventActivities.matchAcceptedAt;
};

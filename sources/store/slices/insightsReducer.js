import { createSlice } from "@reduxjs/toolkit";

const insightsReducer = createSlice({
  name: "insights",
  initialState: {
    /* { from , to , title } */
    insightsPeriod: { from: "", to: "", title: "" },

    reposts: null,
    shares: null,
    likes: null,
    visits: null,

    overview: null,
    summary: null,
  },
  reducers: {
    setInsightPeriod: (state, action) => {
      state.insightsPeriod = action.payload;
    },

    setInsightsForType: (state, action) => {
      const { insights, type } = action.payload;

      state[type] = insights;
    },

    setInsightsOverview: (state, action) => {
      state.overview = action.payload;
    },

    flushInsights: (state, _) => {
      state.reposts = null;
      state.shares = null;
      state.likes = null;
      state.visits = null;
      state.summary = null;
      state.overview = null;
    },
  },
});

export const {
  setInsightPeriod,
  setInsightsForType,
  setInsightsOverview,
  flushInsights,
} = insightsReducer.actions;

export const getInsightsPeriod = (state) => {
  return state.insights.insightsPeriod;
};

export const getInsightsDetailState = (state, type) => {
  if (!type) {
    return null;
  }

  return state.insights[type];
};

export const getInsightsOverviewState = (state) => {
  return state.insights.overview;
};

export default insightsReducer.reducer;

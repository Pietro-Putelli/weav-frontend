import { createSlice } from "@reduxjs/toolkit";
import { unionBy } from "lodash";

const spotsReducer = createSlice({
  name: "spots",
  initialState: {
    spots: [],

    mySpots: [],
  },
  reducers: {
    setSpotsState: (state, action) => {
      const { data, businessId } = action.payload;

      state.spots = data.map((spot) => {
        return { ...spot, business_id: businessId };
      });
    },

    appendSpotsState: (state, action) => {
      const { data, businessId } = action.payload;

      const newSpots = data.map((spot) => {
        return { ...spot, business_id: businessId };
      });

      state.spots = unionBy(state.spots, newSpots, "id");
    },

    updateSpotState: (state, action) => {
      const { spotId, data } = action.payload;

      state.spots = state.spots.map((spot) => {
        if (spot.id === spotId) {
          return { ...spot, ...data };
        }
        return spot;
      });
    },

    setMySpotsState: (state, action) => {
      state.mySpots = action.payload;
    },

    createMySpotState: (state, action) => {
      state.mySpots = unionBy([action.payload], state.mySpots, "id");
    },

    deleteMySpotState: (state, action) => {
      state.mySpots = state.mySpots.filter((spot) => {
        return spot.id !== action.payload;
      });
    },
  },
});

export const {
  setSpotsState,
  appendSpotsState,
  updateSpotState,
  setMySpotsState,
  createMySpotState,
  deleteMySpotState,
} = spotsReducer.actions;

export default spotsReducer.reducer;

export const getBusinessSpotsState = (state, businessId) => {
  return state.spots.spots.filter((spot) => {
    return spot.business_id === businessId;
  });
};

export const getMySpotsState = (state) => {
  return state.spots.mySpots;
};

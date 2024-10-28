import { createSlice } from "@reduxjs/toolkit";

const chanceReducer = createSlice({
  name: "chance",
  initialState: {
    chance: null,
  },
  reducers: {
    setChance: (state, action) => {
      state.chance = action.payload;
    },

    removeChance: (state, _) => {
      state.chance = null;
    },

    removeChanceForUser: (state, action) => {
      const userId = action.payload;

      if (state.chance.user.id == userId) {
        state.chance = null;
      }
    },
  },
});

export const { setChance, removeChance, removeChanceForUser } =
  chanceReducer.actions;

export const getChanceState = (state) => {
  return state.chance.chance;
};

export default chanceReducer.reducer;

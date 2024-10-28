import { createSlice } from "@reduxjs/toolkit";

const secretReducer = createSlice({
  name: "secret",
  initialState: {
    userToken: null,
    businessToken: null,
    privateKey: null,
  },
  reducers: {
    setSecretInfo: (state, action) => {
      const payload = action.payload;

      if (payload.userToken) {
        state.userToken = payload.userToken;
      }

      if (payload.businessToken) {
        state.businessToken = payload.businessToken;
      }

      if (payload.privateKey) {
        state.privateKey = payload.privateKey;
      }
    },
    clearSecretInfo: (state, _) => {
      state.userToken = null;
      state.businessToken = null;
      state.privateKey = null;
    },
  },
});

export const { setSecretInfo, clearSecretInfo } = secretReducer.actions;

export const getUserSecretInfo = (state) => {
  return state.secret;
};

export default secretReducer.reducer;

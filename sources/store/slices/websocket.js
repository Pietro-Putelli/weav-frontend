import { createSlice } from "@reduxjs/toolkit";
import { DOMAIN_NAME } from "../../backend/endpoints";

const websocket = createSlice({
  name: "websocket",
  initialState: {
    root: null,
  },
  reducers: {
    connectWebSocket: (state, action) => {
      const { type, token } = action.payload;

      const url = `ws://${DOMAIN_NAME}/ws/chat/list/?token=${token}`;
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("open connection");
      };

      socket.onclose = () => {
        console.log("close connection");
      };

      state[type] = socket;
    },
    closeWebSocket: (state, action) => {
      const type = action.payload;
      state[type]?.close();
      state[type] = null;
    },
    onSocketMessage: (state, action) => {
      const { type, callback } = action.payload;

      state[type].onmessage = ({ data }) => {
        const parsedData = JSON.parse(data);
        callback(parsedData);
      };
    },
  },
});

export const { connectWebSocket, closeWebSocket, onSocketMessage } =
  websocket.actions;

export const getWebSocket = (state) => state.websocket.root;

export default websocket.reducer;

import { useEffect } from "react";
import ReconnectingWebSocket from "react-native-reconnecting-websocket";
import { useSelector } from "react-redux";
import { WEBSOCKET_DOMAIN } from "../backend/endpoints";
import { socketactions } from "../constants";
import { getUserSecretInfo } from "../store/slices/secretReducer";
import { isAndroidDevice } from "../utility/functions";
import useCurrentBusiness from "./useCurrentBusiness";

const isAndroid = isAndroidDevice();

var webSocket = null;

const getSocket = (isBusiness, authToken) => {
  let socketUrl = WEBSOCKET_DOMAIN;

  if (isBusiness) {
    socketUrl += `business/?token=${authToken}`;
  } else {
    socketUrl += `user/?token=${authToken}`;
  }

  return new ReconnectingWebSocket(socketUrl, null, {
    reconnectInterval: 3000,
    maxReconnectAttempts: 3,
  });
};

export const closeWebSocket = () => {
  if (webSocket) {
    webSocket.close();
    webSocket = null;
  }
};

var lastIsBusinessValue;

const useSharedWebSocket = (onMessage, dependencies = []) => {
  const { isBusiness } = useCurrentBusiness();
  const { userToken, businessToken } = useSelector(getUserSecretInfo);

  const authToken = isBusiness ? businessToken : userToken;

  useEffect(() => {
    if (lastIsBusinessValue != isBusiness) {
      lastIsBusinessValue = isBusiness;
      closeWebSocket();
    }
  }, [isBusiness]);

  useEffect(() => {
    if (webSocket) {
      return;
    }

    if (authToken) {
      openWebSocket();
    }
  }, [authToken, isBusiness]);

  const openWebSocket = () => {
    webSocket = getSocket(isBusiness, authToken);

    webSocket.onopen = () => {
      console.log(`[${isAndroid ? "ANDROID" : "IOS"} SOCKET] => OPEN`);
    };

    webSocket.onclose = () => {
      console.log(`[${isAndroid ? "ANDROID" : "IOS"} SOCKET] => CLOSED`);

      if (webSocket) {
        webSocket.reconnect();
      }
    };

    webSocket.onerror = (e) => {
      console.log("[SOCKET] => ERROR", e);
    };
  };

  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = ({ data }) => {
        onMessage?.(data);
      };
    }
  }, dependencies);

  /* { action , message } */
  const sendMessage = (message) => {
    if (webSocket) {
      webSocket.send(
        JSON.stringify({ message, action: socketactions.MESSAGE })
      );
    }
  };

  return { sendMessage };
};

export default useSharedWebSocket;

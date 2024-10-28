import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getIsServerReachable } from "../store/slices/utilityReducer";

const useReachability = (callback) => {
  const [_isConnected, setIsConnected] = useState(null);

  const isServerReachable = useSelector(getIsServerReachable);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      setIsConnected(isConnected);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (callback) {
      callback(_isConnected);
    }
  }, [_isConnected]);

  const hasConnection = _isConnected == true || _isConnected == null;

  return {
    isConnected: hasConnection && isServerReachable,
    status: {
      locale: _isConnected,
      server: isServerReachable,
    },
  };
};

export default useReachability;

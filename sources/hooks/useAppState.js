import { useAppState as useAppStateHook } from "@react-native-community/hooks";
import { useEffect } from "react";

const useAppState = (callback, dependencies = []) => {
  const appState = useAppStateHook();

  useEffect(() => {
    callback({ isActive: appState == "active", appState });
  }, [appState, ...dependencies]);
};

export default useAppState;

import { useEffect, useState } from "react";
import { Linking } from "react-native";

const useAppLinkListener = (callback, dependencies = []) => {
  const [hasListener, setHasListener] = useState(false);

  const urlCallback = (url) => {
    if (url) {
      var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;

      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }

      callback(params);
    }
  };

  useEffect(() => {
    const getInitial = async () => {
      const url = await Linking.getInitialURL();
      urlCallback(url);
    };

    if (!hasListener) {
      getInitial();
    }

    Linking.addEventListener("url", ({ url }) => {
      urlCallback(url);

      if (!hasListener) {
        setHasListener(true);
      }
    });

    return () => {
      Linking.removeAllListeners("url");
    };
  }, [hasListener, ...dependencies]);
};

export default useAppLinkListener;

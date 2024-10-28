import { isUndefined } from "lodash";
import { useEffect } from "react";
import { EventRegister } from "react-native-event-listeners";

const useEventListener = (
  { identifier, disabled },
  callback,
  dependencies = []
) => {
  useEffect(() => {
    if (isUndefined(identifier)) {
      return;
    }

    EventRegister.addEventListener(identifier, callback);

    return () => {
      EventRegister.removeEventListener(identifier);
    };
  }, [disabled, ...dependencies]);
};

export default useEventListener;

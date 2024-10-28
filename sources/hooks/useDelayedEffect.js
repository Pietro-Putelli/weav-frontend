import { useEffect } from "react";

const useDelayedEffect = (delay, callback, dependencies = []) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
    }, delay ?? 0);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, dependencies);
};

export default useDelayedEffect;

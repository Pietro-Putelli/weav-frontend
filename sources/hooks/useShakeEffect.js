import { useEffect, useRef } from "react";
import { Accelerometer } from "expo-sensors";
import { triggerHaptic } from "../utility/haptics";

const useShakeEffect = ({ isHaptic }, callback) => {
  const isShaking = useRef(false);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);

    Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);

      const sensibility = 3;

      if (!isShaking.current && acceleration >= sensibility) {
        isShaking.current = true;

        setTimeout(() => {
          callback(acceleration);

          if (isHaptic) {
            triggerHaptic();
          }
        }, 100);
      }
    });

    return () => {
      Accelerometer.removeAllListeners();
    };
  }, []);

  const onShakeEnd = () => {
    isShaking.current = false;
  };

  return {
    onShakeEnd,
  };
};

export default useShakeEffect;

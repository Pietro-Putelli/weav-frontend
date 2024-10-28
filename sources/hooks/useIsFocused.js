import useFocusEffect from "./useFocusEffect";
import { useState } from "react";

const useIsFocused = () => {
  const [isFocused, setIsFocused] = useState(true);

  useFocusEffect((focused) => {
    setIsFocused(focused);
  });

  return isFocused;
};

export default useIsFocused;

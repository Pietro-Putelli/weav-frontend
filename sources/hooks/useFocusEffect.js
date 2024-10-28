import React from "react";
import {
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from "react-native-navigation-hooks/dist";

const useFocusEffect = (callback) => {
  useNavigationComponentDidDisappear(() => {
    callback(false);
  });

  useNavigationComponentDidAppear(() => {
    callback(true);
  });
};

export default useFocusEffect;

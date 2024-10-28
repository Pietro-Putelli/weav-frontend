import React, { memo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { FadeAnimatedView } from "../animations";

import { BarIndicator } from "react-native-indicators";

const { width } = Dimensions.get("window");

const SIDE = width / 14;

const LoaderView = ({ isLoading, side = SIDE, percentage = 1, style }) => {
  return (
    <FadeAnimatedView
      mode={"fade"}
      style={[
        style,
        {
          width: side * percentage,
          height: side * percentage,
        },
      ]}
    >
      {(isLoading == true || isLoading == undefined) && (
        <FadeAnimatedView mode="fade" style={StyleSheet.absoluteFillObject}>
          <BarIndicator size={side * percentage} count={3} color={"white"} />
        </FadeAnimatedView>
      )}
    </FadeAnimatedView>
  );
};

export default memo(LoaderView);

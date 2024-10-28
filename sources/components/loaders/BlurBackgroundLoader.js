import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { FadeAnimatedView } from "../animations";
import { LoaderView } from "../views";

const BlurBackgroundLoader = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <FadeAnimatedView mode="fade" style={styles.container}>
      <LoaderView />
    </FadeAnimatedView>
  );
};

export default memo(BlurBackgroundLoader);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

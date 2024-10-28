import React, { memo } from "react";
import { StyleSheet } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { LoaderView } from "../views";

const FullScreenLoader = ({ style, isLoading }) => {
  const theme = useTheme();

  if (!isLoading) {
    return null;
  }

  return (
    <FadeAnimatedView mode="fade" style={[styles.container, style]}>
      <Animated.View
        entering={ZoomIn.damping(16).springify()}
        style={[styles.loaderContainer, theme.styles.shadow_round]}
      >
        <LoaderView />
      </Animated.View>
    </FadeAnimatedView>
  );
};

export default memo(FullScreenLoader);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    padding: "6%",
  },
});

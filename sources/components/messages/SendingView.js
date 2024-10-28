import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { MainText } from "../texts";

const LOADER_VIEW_WIDTH = widthPercentage(0.2);
const LOADER_SIDE = 1;

const SendingView = ({ message }) => {
  const isSent = message.sent == undefined;

  if (isSent) return null;

  return (
    <FadeAnimatedView mode="fade" style={styles.container}>
      <MainText font={"subtitle-4"}>Sending...</MainText>
    </FadeAnimatedView>
  );
};

export default memo(SendingView);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 8,
    right: -LOADER_VIEW_WIDTH * 1.5,
  },
  loader: {
    width: LOADER_SIDE,
    height: LOADER_SIDE,
  },
});

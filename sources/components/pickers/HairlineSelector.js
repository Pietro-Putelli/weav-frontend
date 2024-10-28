import React from "react";
import { StyleSheet, View } from "react-native";
import { CELL_HEIGHT } from "./constants";

const HairlineSelector = () => {
  return (
    <>
      <View style={styles.hairline} />
      <View style={[styles.hairline, { top: CELL_HEIGHT * 2 }]} />
    </>
  );
};

export default HairlineSelector;

const styles = StyleSheet.create({
  hairline: {
    width: "80%",
    position: "absolute",
    top: CELL_HEIGHT,
    zIndex: 10,
    alignSelf: "center",
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});

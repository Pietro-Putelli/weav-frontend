import { BlurView } from "expo-blur";
import React, { memo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { SquareImage } from "../images";

const CONTAINER_SIDE = widthPercentage(0.08);

const AudioStatusView = ({ isMuted, setIsMuted }) => {
  return (
    <Pressable
      onPress={() => {
        setIsMuted(!isMuted);
      }}
      style={styles.container}
    >
      <BlurView intensity={60} tint="dark" style={styles.content}>
        <SquareImage
          color="white"
          side={CONTAINER_SIDE * 0.6}
          source={!isMuted ? icons.AudioOn : icons.AudioOff}
        />
      </BlurView>
    </Pressable>
  );
};

export default memo(AudioStatusView);

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    bottom: 16,
    right: 16,
    overflow: "hidden",
    position: "absolute",
    width: CONTAINER_SIDE,
    height: CONTAINER_SIDE,
    borderRadius: CONTAINER_SIDE / 2.2,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFill,
  },
});

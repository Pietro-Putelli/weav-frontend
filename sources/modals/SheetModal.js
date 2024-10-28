import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTheme } from "../hooks";
import { insets } from "../styles";

const SheetModal = ({ visible, setVisible, children }) => {
  const theme = useTheme();

  /* Animated Styles */

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: "black",
    };
  });

  return (
    <Modal
      transparent
      presentationStyle="overFullScreen"
      animationType="slide"
      visible={visible}
    >
      <Animated.View
        style={[animatedBackdropStyle, StyleSheet.absoluteFillObject]}
      />

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={[
            theme.styles.shadow_round,
            { paddingBottom: insets.bottom },
            styles.container,
          ]}
        >
          <View
            style={[{ backgroundColor: theme.white_alpha(0.5) }, styles.cursor]}
          />

          <View>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

export default SheetModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  cursor: {
    height: 4,
    width: "30%",
    borderRadius: 8,
    marginVertical: "3%",
    alignSelf: "center",
  },
});

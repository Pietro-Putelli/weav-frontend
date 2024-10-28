import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, { ZoomInRotate, ZoomOut } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { SquareImage } from "../images";
import { BounceView } from "../views";

const BUTTON_SIDE = widthPercentage(0.1);

const AddPostButton = ({ icon, onPress }) => {
  const theme = useTheme();

  const containerStyle = useMemo(() => {
    return {
      backgroundColor: theme.colors.main_accent,
      ...styles.container,
    };
  }, []);

  return (
    <Animated.View
      entering={ZoomInRotate.damping(11).springify()}
      exiting={ZoomOut.duration(400)}
      style={containerStyle}
    >
      <BounceView onPress={onPress}>
        <SquareImage percentage={0.72} source={icon ?? icons.Add} />
      </BounceView>
    </Animated.View>
  );
};

export default memo(AddPostButton);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: BUTTON_SIDE,
    height: BUTTON_SIDE,
    borderRadius: BUTTON_SIDE / 2.3,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
});

import React, { memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAnimatedStyle } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { widthPercentage } from "../../styles/sizes";
import { AnimatedBackgroundColorView } from "../animations";
import { MainText } from "../texts";

const SIDE = widthPercentage(0.04);

const LiveDot = ({ style, hideLabel }) => {
  const theme = useTheme();

  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsOn(!isOn);
    }, 600);
  }, [isOn]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: theme.colors.red,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <AnimatedBackgroundColorView
        isActive={isOn}
        colors={[theme.colors.red, "#b31b1b50"]}
        style={[animatedContainerStyle, styles.dot]}
      />
      {!hideLabel && (
        <MainText uppercase bold font="subtitle-3" style={{ marginLeft: 7 }}>
          live
        </MainText>
      )}
    </View>
  );
};

export default memo(LiveDot);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: SIDE,
    height: SIDE,
    borderRadius: SIDE / 2,
  },
});

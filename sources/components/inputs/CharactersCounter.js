import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
// import CircularProgress from "react-native-circular-progress-indicator";
import Animated from "react-native-reanimated";
import { Circle } from "react-native-svg";
import { widthPercentage } from "../../styles/sizes";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIDE = widthPercentage(0.07);

const ACCENT_COLOR = "#660AE0";
const STROKE_WIDTH = 2;

const CIRCLE_SIDE = SIDE - 6;
const CENTER = CIRCLE_SIDE / 2 + 3;
const R = CIRCLE_SIDE / 2;
const CIRCLE_LENGTH = R * 2 * Math.PI;

const CharactersCounter = ({ count, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* <CircularProgress
        radius={20}
        value={count / 2}
        activeStrokeWidth={4}
        progressValueColor={"#ecf0f1"}
      /> */}
      {/* <Svg style={styles.svg}>
        <AnimatedCircle
          cx={CENTER}
          cy={CENTER}
          r={R}
          strokeWidth={STROKE_WIDTH}
          stroke={ACCENT_COLOR}
          strokeLinecap="round"
          strokeDasharray={CIRCLE_LENGTH}
          strokeDashoffset={
            CIRCLE_LENGTH * (1 - count / MAX_USER_MOMENT_CHAR_COUNT)
          }
          fill="transparent"
        />
      </Svg>

      <MainText font="subtitle-4" style={{ marginTop: 4 }}>
        {count}
      </MainText> */}
    </View>
  );
};

export default memo(CharactersCounter);

const styles = StyleSheet.create({
  container: {
    width: SIDE,
    height: SIDE,
    alignItems: "center",
    justifyContent: "center",
  },
  svg: { transform: [{ rotate: "-90deg" }] },
});

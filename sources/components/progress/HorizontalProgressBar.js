import React from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useTheme } from "../../hooks";

const { width } = Dimensions.get("window");

const HorizontalProgressBar = ({ progress }) => {
  const theme = useTheme();

  const progressValue = useDerivedValue(() => {
    return progress * 100;
  }, [progress]);

  const aniamtedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  }, []);

  return (
    <View style={{ width, height: 4, backgroundColor: theme.white_alpha(0.2) }}>
      <Animated.View
        style={[
          { backgroundColor: theme.colors.main_accent, height: "100%" },
          aniamtedStyle,
        ]}
      />
    </View>
  );
};

export default HorizontalProgressBar;

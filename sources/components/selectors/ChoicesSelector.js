import { MotiView } from "moti";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { FadeAnimatedView, ScaleAnimatedView } from "../animations";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");
const CHOICE_WIDTH = width / 3;
const BADGE_SIDE = 20;

const ChoicesSelector = ({ selected = 0, onChange, choices }) => {
  const theme = useTheme();

  /* Styles */

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.container,
    };
  }, []);

  const selectorStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round_second,
      ...styles.selector,
    };
  }, []);

  const badgeStyle = useMemo(() => {
    return {
      ...styles.badge,
      backgroundColor: theme.colors.main_accent,
    };
  }, []);

  const translateX = useDerivedValue(() => {
    return withSpring(selected * CHOICE_WIDTH, {
      damping: 16,
    });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <FadeAnimatedView style={containerStyle}>
      <Animated.View style={[selectorStyle, animatedStyle]} />

      {choices.map((choice, index) => {
        const { title } = choice;
        const count = choice?.count ?? 0;

        return (
          <BounceView
            haptic
            activeScale={0.9}
            onPress={() => {
              onChange(index);
            }}
            style={styles.cell}
            key={title}
          >
            <MainText align="center" font="subtitle-3" bold uppercase>
              {title}
            </MainText>

            {count > 0 && (
              <ScaleAnimatedView
                style={[
                  badgeStyle,
                  { width: BADGE_SIDE + (count > 9 ? 8 : 0) },
                ]}
              >
                <MainText style={styles.badgeTitle}>
                  {count > 9 ? "9+" : count}
                </MainText>
              </ScaleAnimatedView>
            )}
          </BounceView>
        );
      })}
    </FadeAnimatedView>
  );
};

export default memo(ChoicesSelector);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    padding: 4,
    paddingHorizontal: 8,
    width: CHOICE_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selector: {
    height: 40,
    width: CHOICE_WIDTH,
    position: "absolute",
    left: 12,
  },
  badge: {
    marginLeft: 8,
    height: BADGE_SIDE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BADGE_SIDE / 2.4,
  },
  badgeTitle: {
    fontWeight: "bold",
    fontSize: 12,
    paddingLeft: 2,
  },
});

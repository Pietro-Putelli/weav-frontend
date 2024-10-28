import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { InsightSourceCellSize } from "../../styles/sizes";
import { TranslateAnimatedView } from "../animations";
import { CacheableImageView } from "../images";
import { BounceView } from "../views";

const CELL_WIDTH = InsightSourceCellSize.width;
const CELL_HEIGHT = InsightSourceCellSize.height;

const ThumbnailSliceItem = memo(({ onPress, scrollX, item, index }) => {
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CELL_WIDTH,
      index * CELL_WIDTH,
      (index + 1) * CELL_WIDTH,
    ];

    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [0.85, 1, 0.85],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const sourceStyle = useMemo(() => {
    return [theme.styles.shadow_round, StyleSheet.absoluteFillObject];
  }, []);

  return (
    <TranslateAnimatedView mode="right">
      <BounceView
        onPress={() => onPress({ item, index })}
        style={{
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
        }}
      >
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <CacheableImageView style={sourceStyle} source={item.source} />
        </Animated.View>
      </BounceView>
    </TranslateAnimatedView>
  );
});

export default memo(ThumbnailSliceItem);

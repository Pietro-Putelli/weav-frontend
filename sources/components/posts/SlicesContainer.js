import { size } from "lodash";
import React, { memo, useCallback, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { FadeAnimatedView } from "../animations";
import { AdvancedFlatList } from "../lists";
import SliceContent from "./SliceContent";

const { width, height } = Dimensions.get("window");

const SlicesContainer = ({ post, index, scrollX }) => {
  const { slices } = post;

  const scrollY = useSharedValue(0);
  const scrollRef = useRef();

  const scrollEnabled = size(slices) > 1;

  /* Methods */

  /* Components */

  const renderItem = useCallback(({ item, index }) => {
    return <SliceContent scrollY={scrollY} index={index} slice={item} />;
  }, []);

  /* Styles */

  const containerStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const outputRange = [0.85, 1, 0.85];

    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <FadeAnimatedView mode="fade" style={[containerStyle, styles.container]}>
      <View style={styles.content}>
        <AdvancedFlatList
          data={slices}
          pagingEnabled
          bounces={false}
          ref={scrollRef}
          scrollY={scrollY}
          disabledAnimation
          renderItem={renderItem}
          scrollEnabled={scrollEnabled}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    </FadeAnimatedView>
  );
};

export default memo(SlicesContainer);

const styles = StyleSheet.create({
  container: { width, height },
  content: { flex: 1, paddingLeft: 5 },
  contentContainerStyle: {
    paddingBottom: 0,
  },
});

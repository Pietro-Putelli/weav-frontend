import React, { memo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { widthPercentage } from "../../styles/sizes";
import { EventSlicePreviewCell } from "../cells";
import { HorizontalCarousel } from "../lists";

const CELL_WIDTH = widthPercentage(0.65);

const SlicesCarousel = ({
  slices,
  isEditing,
  onPress,
  sliderWidth,
  onSliceChanged,
  onRemovePress,
  onLongPress,
}) => {
  const slicesCount = slices.length;
  const initialScrollIndex = Math.max(0, slicesCount - 1);

  const carouselRef = useRef();
  const carouselScrollX = useSharedValue(0);

  /* Callbacks */

  const _onPress = ({ item, index }) => {
    carouselRef?.current?.scrollToIndex({ index });

    onPress?.(item);
  };

  /* Components */

  const renderItem = ({ item, index }) => {
    const hideRemoveButton = (index == 0 && slicesCount == 1) || !isEditing;

    return (
      <EventSlicePreviewCell
        slice={item}
        hideRemoveButton={hideRemoveButton}
        onPress={() => _onPress({ item, index })}
        onRemovePress={() => onRemovePress(item)}
        onLongPress={() => onLongPress?.({ item, index })}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sourceContent}>
        <HorizontalCarousel
          data={slices}
          ref={carouselRef}
          sliderWidth={sliderWidth}
          scrollX={carouselScrollX}
          itemWidth={CELL_WIDTH}
          renderItem={renderItem}
          onSnapToItem={({ index }) => {
            onSliceChanged?.(index);
          }}
          keyboardShouldPersistTaps="always"
          initialScrollIndex={initialScrollIndex}
        />
      </View>
    </View>
  );
};

export default memo(SlicesCarousel);

const styles = StyleSheet.create({
  container: {
    marginTop: "2%",
    marginBottom: "6%",
  },
  sourceContent: {
    justifyContent: "center",
  },
});

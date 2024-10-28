import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { icons } from "../../styles";
import { BORDER_RADIUS, ICON_SIZES, widthPercentage } from "../../styles/sizes";
import { TranslateAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { CacheableImageView } from "../images";
import { BounceView } from "../views";

const CELL_WIDTH = widthPercentage(0.65);

const EventSlicePreviewCell = ({
  slice,
  onPress,
  onLongPress,
  onRemovePress,
  hideRemoveButton,
}) => {
  const source = useMemo(() => {
    if (typeof slice?.source === "string") {
      return slice.source;
    }

    return slice.source.uri;
  }, [slice]);

  return (
    <TranslateAnimatedView>
      <BounceView
        onPress={() => {
          onPress(slice);
        }}
        onLongPress={() => {
          onLongPress(slice);
        }}
        style={styles.container}
      >
        <CacheableImageView style={styles.image} source={source} />

        {!hideRemoveButton && (
          <View style={styles.removeButton}>
            <IconButton
              source={icons.Cross}
              blur
              side={ICON_SIZES.three}
              inset={1}
              onPress={() => onRemovePress(slice)}
            />
          </View>
        )}
      </BounceView>
    </TranslateAnimatedView>
  );
};

export default memo(EventSlicePreviewCell);

const styles = StyleSheet.create({
  container: {
    width: CELL_WIDTH,
    height: (CELL_WIDTH * 16) / 10,
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
  },
  image: StyleSheet.absoluteFillObject,
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

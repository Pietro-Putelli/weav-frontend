import React, { forwardRef, memo, useCallback, useMemo, useRef } from "react";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { isAndroidDevice } from "../../utility/functions";
import { triggerHaptic } from "../../utility/haptics";
import { Dimensions } from "react-native";
import { size } from "lodash";

const isAndroid = isAndroidDevice();

const AnimatedList = Animated.createAnimatedComponent(FlatList);

const { width } = Dimensions.get("window");

const HorizontalCarousel = forwardRef(
  (
    {
      itemWidth,
      data,
      renderItem,
      initialScrollIndex = 0,
      onSnapToItem,
      scrollX,
      translateXValue,
      hapticEnabled,
      fastSelectionEnabled,
      onScrollStatusChange,
      contentContainerStyle,
      sliderWidth,
      onEndReached,
      bulkCount,
      ...props
    },
    ref
  ) => {
    const _scrollX = useSharedValue(initialScrollIndex * itemWidth);

    const endReached = useRef(false);

    const dataSize = useMemo(() => {
      return size(data);
    }, [data]);

    const paddingHorizontal = useMemo(() => {
      return (sliderWidth ?? width) / 2 - itemWidth / 2;
    }, []);

    const _onScroll = (x) => {
      if (fastSelectionEnabled) {
        const index = Math.max(0, Math.floor(x / (itemWidth - 4)));
        onSnapToItem?.({ item: data[index], index });
      }
    };

    const onScroll = useAnimatedScrollHandler(({ contentOffset: { x } }) => {
      if (scrollX) {
        scrollX.value = x;
      }

      _scrollX.value = x;

      runOnJS(_onScroll)(x);
    });

    const getItemLayout = useCallback(
      (_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      }),
      []
    );

    const onMomentumScrollEnd = ({
      nativeEvent: {
        contentOffset: { x },
      },
    }) => {
      if (fastSelectionEnabled) {
        return;
      }

      const index = Math.max(0, Math.floor(x / (itemWidth - 4)));

      onSnapToItem?.({ item: data[index], index });
    };

    const onMomentumScrollBegin = () => {
      if (hapticEnabled && !isAndroid) {
        triggerHaptic();
      }
    };

    const _onEndReached = useCallback(() => {
      if (!endReached.current && dataSize > 0 && dataSize % bulkCount === 0) {
        endReached.current = true;

        onEndReached?.();
      }
    }, [onEndReached, dataSize]);

    const _renderItem = (props) => {
      return (
        <Item
          scrollX={_scrollX}
          itemWidth={itemWidth}
          renderItem={renderItem}
          translateXValue={translateXValue}
          {...props}
        />
      );
    };

    return (
      <AnimatedList
        overScrollMode={"never"}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={itemWidth}
        keyExtractor={(item) => item?.id?.toString() ?? item}
        ref={ref}
        data={data}
        horizontal
        onMomentumScrollBegin={onMomentumScrollBegin}
        renderItem={_renderItem}
        getItemLayout={getItemLayout}
        contentContainerStyle={{ paddingHorizontal, ...contentContainerStyle }}
        snapToAlignment="start"
        decelerationRate={"fast"}
        contentOffset={{ x: itemWidth * initialScrollIndex }}
        extraData={data}
        onEndReached={_onEndReached}
        {...props}
      />
    );
  }
);

export default memo(HorizontalCarousel);

const Item = memo(
  ({ scrollX, translateXValue = 0, itemWidth, item, index, renderItem }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * itemWidth,
        itemWidth * index,
        (index + 1) * itemWidth,
      ];
      return {
        transform: [
          {
            scale: interpolate(
              scrollX.value,
              inputRange,
              [0.9, 1, 0.9],
              Extrapolate.CLAMP
            ),
          },
          {
            translateY: interpolate(
              scrollX.value,
              inputRange,
              [10, 0, 10],
              Extrapolate.CLAMP
            ),
          },
          {
            translateX: interpolate(
              scrollX.value,
              inputRange,
              [-translateXValue, 0, translateXValue],
              Extrapolate.CLAMP
            ),
          },
        ],
        opacity: interpolate(
          scrollX.value,
          inputRange,
          [0.5, 1, 0.5],
          Extrapolate.CLAMP
        ),
      };
    });

    return (
      <Animated.View style={animatedStyle}>
        {renderItem({ item, index })}
      </Animated.View>
    );
  }
);

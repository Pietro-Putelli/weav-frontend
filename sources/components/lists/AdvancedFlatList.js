import { FlashList } from "@shopify/flash-list";
import { isUndefined, size } from "lodash";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  LayoutAnimation,
  RefreshControl,
  SectionList,
  StyleSheet,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { LoaderView } from "../views";
import { useEventListener } from "../../hooks";
import { insets } from "../../styles";
import { FadeAnimatedView } from "../animations";
import mergeRefs from "../../utility/mergeRefs";
import { ScrollDirections } from "../../constants";
import { FlatList } from "react-native-gesture-handler";

const AdvancedFlatList = forwardRef(
  (
    {
      data,
      sections,
      isLoading,
      isRefreshing,

      bulkCount,
      itemSize,
      estimatedItemSize,
      renderItem,

      scrollX,
      scrollY,
      onScroll,

      inverted,
      horizontal,
      enabledAnimation,
      fastSelectionEnabled,
      contentContainerStyle,
      layoutAnimationIdentifier,

      onRefresh,
      onEndReached,
      onMomentumScrollEnd,
      onChangeIndex,
      onChangeDirection,

      ...props
    },
    ref
  ) => {
    /* Props */

    const dataSize = useMemo(() => {
      return size(data);
    }, [data]);

    const isFlashList = useMemo(() => {
      return !isUndefined(estimatedItemSize);
    }, []);

    const _contentContainerStyle = useMemo(() => {
      return {
        paddingBottom: insets.bottom,
        ...contentContainerStyle,
      };
    }, [contentContainerStyle]);

    /* States */

    const listRef = useRef();

    const endReached = useRef(false);
    const latestDataSize = useRef(dataSize);

    const lastIndex = useRef(0);
    const lastYOffset = useRef(0);

    /* Effects */

    useEffect(() => {
      endReached.current = false;

      if (dataSize > latestDataSize.current) {
        latestDataSize.current = dataSize;
      }

      if (dataSize < latestDataSize.current) {
        refreshLayout();
      }
    }, [dataSize]);

    useEventListener(
      { identifier: layoutAnimationIdentifier },
      () => {
        refreshLayout();
      },
      []
    );

    /* Callbacks */

    const _onEndReached = useCallback(() => {
      if (!endReached.current && dataSize > 0 && dataSize % bulkCount === 0) {
        endReached.current = true;

        onEndReached?.();
      }
    }, [onEndReached, dataSize]);

    const _onScroll = useCallback(
      (nativeEvent) => {
        onScroll?.(nativeEvent);

        const { contentOffset } = nativeEvent;
        const { y, x } = contentOffset;

        if (fastSelectionEnabled) {
          const offsetValue = horizontal ? x : y;

          if (itemSize && onChangeIndex) {
            const index = Math.max(0, Math.floor(offsetValue / itemSize));
            let maxInData = Math.min(index, dataSize - 1);

            if (maxInData != lastIndex.current) {
              lastIndex.current = maxInData;
              onChangeIndex(maxInData);
            }
          }
        }

        // Check if the user has reached the end of the list

        if (!isUndefined(onChangeDirection)) {
          const { contentSize, layoutMeasurement } = nativeEvent;

          if (y >= contentSize.height - layoutMeasurement.height) {
            return;
          }

          const direction =
            y >= lastYOffset.current && y > 50
              ? ScrollDirections.DOWN
              : ScrollDirections.UP;

          lastYOffset.current = y;

          onChangeDirection(direction);
        }
      },
      [
        onScroll,
        itemSize,
        dataSize,
        horizontal,
        onChangeIndex,
        onChangeDirection,
        fastSelectionEnabled,
      ]
    );

    const onScrollHandler = useAnimatedScrollHandler((nativeEvent) => {
      const {
        contentOffset: { x, y },
      } = nativeEvent;

      if (scrollY) {
        scrollY.value = y;
      }

      if (scrollX) {
        scrollX.value = x;
      }

      runOnJS(_onScroll)(nativeEvent);
    });

    const _onMomentumScrollEnd = useCallback(
      ({ nativeEvent: { contentOffset } }) => {
        onMomentumScrollEnd?.({ ...contentOffset });

        const { y, x } = contentOffset;
        const offsetValue = horizontal ? x : y;

        if (itemSize && onChangeIndex && !fastSelectionEnabled) {
          const index = Math.max(0, Math.floor(offsetValue / itemSize));
          let maxInData = Math.min(index, dataSize - 1);

          onChangeIndex(maxInData);
        }
      },
      [
        itemSize,
        dataSize,
        horizontal,
        onChangeIndex,
        onMomentumScrollEnd,
        fastSelectionEnabled,
      ]
    );

    /* Methods */

    const keyExtractor = useCallback(
      (item) => item?.id?.toString() ?? item?.title?.toString() ?? item,
      []
    );

    const getItemLayout = useCallback(
      (_, index) => {
        return {
          length: itemSize,
          offset: itemSize * index,
          index,
        };
      },
      [itemSize]
    );

    const refreshLayout = () => {
      if (listRef?.current?.prepareForLayoutAnimationRender) {
        listRef.current?.prepareForLayoutAnimationRender();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
    };

    const _renderItem = useCallback(
      (props) => {
        if (enabledAnimation) {
          return <FadeAnimatedView>{renderItem(props)}</FadeAnimatedView>;
        }
        return renderItem(props);
      },
      [enabledAnimation, renderItem]
    );

    if (ref?.current) {
      ref.current.scrollToTop = () => {
        ref.current.scrollToOffset({ offset: 0, animated: true });
      };
    }

    /* Render */

    const ListComponent = useMemo(() => {
      let Component = isFlashList ? FlashList : FlatList;

      if (!isUndefined(sections)) {
        Component = SectionList;
      }

      return Animated.createAnimatedComponent(Component);
    }, [isFlashList, sections]);

    const ListFooterComponent = useMemo(() => {
      if (isLoading) {
        return (
          <LoaderView
            percentage={0.8}
            isLoading={isLoading}
            style={styles.loader}
          />
        );
      }
    }, [isLoading]);

    const refreshControl = useMemo(() => {
      if (!isUndefined(onRefresh)) {
        return (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        );
      }
      return null;
    }, [onRefresh, isRefreshing]);

    return (
      <ListComponent
        ref={mergeRefs([listRef, ref])}
        data={data}
        sections={sections}
        inverted={inverted}
        horizontal={horizontal}
        scrollEventThrottle={1}
        onEndReachedThreshold={0.2}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        contentContainerStyle={_contentContainerStyle}
        renderItem={_renderItem}
        keyExtractor={keyExtractor}
        onEndReached={_onEndReached}
        onScroll={onScrollHandler}
        onMomentumScrollEnd={_onMomentumScrollEnd}
        ListFooterComponent={ListFooterComponent}
        getItemLayout={itemSize ? getItemLayout : null}
        estimatedItemSize={estimatedItemSize}
        overScrollMode="never"
        contentInsetAdjustmentBehavior={"never"}
        {...props}
      />
    );
  }
);

export default memo(AdvancedFlatList);

const styles = StyleSheet.create({
  loader: { marginVertical: "3%", alignSelf: "center" },
});

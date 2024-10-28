import React, { useMemo } from "react";
import { RefreshControl } from "react-native-gesture-handler";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useTheme } from "../../hooks";
import { isUndefined } from "lodash";

const AnimatedScrollView = ({
  scrollY,
  children,
  isRefreshing,
  onRefresh,
  ...props
}) => {
  const theme = useTheme();

  const onScroll = useAnimatedScrollHandler(({ contentOffset: { y } }) => {
    scrollY.value = y;
  });

  const refreshControl = useMemo(() => {
    if (!isUndefined(isRefreshing)) {
      return (
        <RefreshControl
          style={{ zIndex: 100 }}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.main_accent}
        />
      );
    }

    return null;
  }, [isRefreshing, onRefresh]);

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior={"never"}
      {...props}
    >
      {children}
    </Animated.ScrollView>
  );
};

export default AnimatedScrollView;

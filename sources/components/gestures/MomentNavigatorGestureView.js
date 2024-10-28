import React, { memo, useCallback } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { MomentCellSize, widthPercentage } from "../../styles/sizes";
import { BounceView } from "../views";

const NAVIGATION_WIDTH = widthPercentage(0.2);

const MomentNavigatorGestureView = ({
  children,
  onPress,
  onLongPress,
  onNavigationPress,
  style,
  isChatPreview,
  isPreview,
  ...props
}) => {
  const tapGesture = Gesture.Tap().onStart(({ x, y }) => {
    if (isChatPreview) {
      runOnJS(onPress)();
      return;
    }

    const isMenuButtonExcluded = y > MomentCellSize.height * 0.1;
    const isBottomExcluded = y < MomentCellSize.height * 0.9;

    if (x <= NAVIGATION_WIDTH && isBottomExcluded && isMenuButtonExcluded) {
      runOnJS(onNavigationPress)("prev");
    } else if (
      x >= MomentCellSize.width - NAVIGATION_WIDTH &&
      isBottomExcluded &&
      isMenuButtonExcluded
    ) {
      runOnJS(onNavigationPress)("next");
    } else if (isBottomExcluded && isMenuButtonExcluded && !isPreview) {
      runOnJS(onPress)();
    }
  });

  const longGesture = Gesture.LongPress()
    .onStart(() => {
      if (!isPreview) {
        runOnJS(onLongPress)();
      }
    })
    .minDuration(200);

  const renderContent = useCallback(() => {
    return (
      <Animated.View style={style} {...props}>
        {children}
      </Animated.View>
    );
  }, [props]);

  if (isChatPreview) {
    return <BounceView onPress={onPress}>{renderContent()}</BounceView>;
  }

  return (
    <GestureDetector gesture={Gesture.Race(tapGesture, longGesture)}>
      {renderContent()}
    </GestureDetector>
  );
};

export default memo(MomentNavigatorGestureView);

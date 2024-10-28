import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useCurrentBusiness, useDelayedEffect, useTheme } from "../../hooks";
import BusinessHomeScreen from "../business-side/BusinessHomeScreen";
import CameraScreen from "../generals/CameraScreen";
import MomentsScreen from "./MomentsScreen";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ scrollX, onChangeTab, isFocused, ...props }) => {
  const theme = useTheme();
  const scrollRef = useRef();

  /* States */

  const { isBusiness } = useCurrentBusiness();

  const [isCameraLoaded, setIsCameraLoaded] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const isMomentScreenFocus = isFocused && !isCameraVisible;

  /* Effects */

  useDelayedEffect(400, () => {
    setIsCameraLoaded(true);
  });

  /* Methods */

  const onScroll = useAnimatedScrollHandler(({ contentOffset: { x } }) => {
    scrollX.value = x;
  });

  const scrollTo = useCallback((index) => {
    scrollRef.current?.scrollTo({ x: width * index });
  }, []);

  const onCameraClosePress = useCallback(() => scrollTo(1), []);

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }) => {
      setIsCameraVisible(x < width);
    },
    []
  );

  /* Animated Styles */

  const cameraAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [width, 0];

    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [width * 0.8, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const containerStyle = useMemo(() => {
    return {
      width,
      height,
      backgroundColor: theme.colors.background,
    };
  }, [theme]);

  return (
    <View style={containerStyle}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        bounces={false}
        onScroll={onScroll}
        overScrollMode="never"
        scrollEventThrottle={16}
        contentOffset={{ x: width }}
        scrollEnabled={isScrollEnabled}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        {!isBusiness && (
          <Animated.View style={[containerStyle, cameraAnimatedStyle]}>
            {isCameraLoaded && (
              <CameraScreen
                scrollTo={scrollTo}
                isActive={isCameraVisible}
                isLibraryDisabled={!isBusiness}
                onClosePress={onCameraClosePress}
                setIsScrollEnabled={setIsScrollEnabled}
                {...props}
              />
            )}
          </Animated.View>
        )}

        <Animated.View style={containerStyle}>
          {isBusiness ? (
            <BusinessHomeScreen
              onChangeTab={onChangeTab}
              scrollTo={scrollTo}
              {...props}
            />
          ) : (
            <MomentsScreen isFocused={isMomentScreenFocus} {...props} />
          )}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;

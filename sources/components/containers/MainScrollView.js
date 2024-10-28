import { isUndefined } from "lodash";
import React, { forwardRef, useMemo, useRef } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  RefreshControl,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useTheme } from "../../hooks";
import { insets } from "../../styles";
import { TAB_BAR_HEIGHT } from "../../styles/sizes";
import { isAndroidDevice } from "../../utility/functions";
import mergeRefs from "../../utility/mergeRefs";
import { AnimatedBottomContainer, FadeAnimatedView } from "../animations";
import { ToastAlertView } from "../badgeviews";
import { EdgeGesture } from "../gestures";
import { HeaderTitle } from "../headers";
import { LoaderView } from "../views";

const isAndroid = isAndroidDevice();

const AnimatedKeyboardAware = Animated.createAnimatedComponent(
  KeyboardAwareScrollView
);

const { width } = Dimensions.get("window");

const MainScrollView = forwardRef(
  (
    {
      modal,
      title,
      style,
      noBack,
      children,
      rightIcon,
      titleStyle,
      rightButton,
      onBackPress,
      contentStyle,
      onTitlePress,
      onRightPress,
      onHeaderPress,
      scrollEnabled,
      forceRefresh,
      onEndReached,
      disableDismissOnTap,
      renderBottomContent,
      refreshing,
      rightComponent,
      onRefresh,
      isLoading,
      isNotInRoot,
      isBottomContentVisible,
      errorProps,
      keyboardAware,
      contentContainerStyle,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();

    const scrollY = useSharedValue(0);
    const scrollRef = useRef();

    const paddingBottom = useMemo(() => {
      if (isNotInRoot) {
        return 0;
      }

      if (renderBottomContent) {
        return insets.bottom + RFPercentage(12);
      }

      return TAB_BAR_HEIGHT;
    }, [isNotInRoot, renderBottomContent]);

    const _isBottomContentVisible =
      isUndefined(isBottomContentVisible) || isBottomContentVisible == true;

    const onScroll = useAnimatedScrollHandler((nativeEvent) => {
      scrollY.value = nativeEvent.contentOffset.y;
    });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(
              scrollY.value,
              [0, -100],
              [1, 1.05],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    });

    const onScrollToTop = () => {
      if (onHeaderPress) onHeaderPress();

      if (!scrollRef.current) return;
      scrollRef.current.scrollTo({ y: 0 });
    };

    const renderContent = () => (
      <>
        <TouchableWithoutFeedback onPress={onScrollToTop}>
          <HeaderTitle
            isScrollView
            title={title}
            headerY={scrollY}
            {...{
              modal,
              noBack,
              rightIcon,
              titleStyle,
              rightButton,
              onBackPress,
              onRightPress,
              animatedStyle,
              onTitlePress,
              rightComponent,
            }}
          />
        </TouchableWithoutFeedback>

        <View style={styles.content_container}>
          {isUndefined(isLoading) || !isLoading ? (
            <FadeAnimatedView style={[styles.content, contentStyle]}>
              {children}
            </FadeAnimatedView>
          ) : (
            <FadeAnimatedView mode="fade" style={styles.loader_container}>
              <LoaderView />
            </FadeAnimatedView>
          )}
        </View>
      </>
    );

    const ScrollContainer = useMemo(() => {
      return keyboardAware ? AnimatedKeyboardAware : Animated.ScrollView;
    }, [keyboardAware]);

    return (
      <EdgeGesture disabled={!modal}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
            style,
          ]}
        >
          {scrollEnabled == false ? (
            renderContent()
          ) : (
            <ScrollContainer
              ref={mergeRefs([scrollRef, ref])}
              keyboardDismissMode={keyboardAware ? "none" : "on-drag"}
              keyboardShouldPersistTaps={
                disableDismissOnTap ? "always" : "never"
              }
              overScrollMode="never"
              scrollEventThrottle={1}
              onScroll={onScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom,
                flexGrow: 1,
                ...contentContainerStyle,
              }}
              {...props}
              refreshControl={
                onRefresh ? (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                ) : null
              }
              contentInsetAdjustmentBehavior="never"
            >
              {renderContent()}
            </ScrollContainer>
          )}
        </View>

        {/* keyboardVerticalOffset={0} */}

        <KeyboardAvoidingView keyboardVerticalOffset={-RFPercentage(10)}>
          {renderBottomContent && (
            <AnimatedBottomContainer
              isVisible={_isBottomContentVisible}
              style={[
                { backgroundColor: theme.colors.background },
                styles.bottom,
              ]}
            >
              {renderBottomContent()}
            </AnimatedBottomContainer>
          )}
        </KeyboardAvoidingView>

        {!isUndefined(errorProps) && (
          <ToastAlertView visible={errorProps.visible}>
            {errorProps.title}
          </ToastAlertView>
        )}
      </EdgeGesture>
    );
  }
);
export default MainScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content_container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: "1%",
    paddingHorizontal: "2%",
  },
  bottom: {
    width,
    bottom: -1,
    padding: 16,
    position: "absolute",
    borderRadius: 0,
    paddingBottom: insets.bottom + (isAndroid ? 0 : 8),
    borderTopColor: "rgba(255,255,255,0.1)",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(9,6,22,0.96)",
  },
  loader_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

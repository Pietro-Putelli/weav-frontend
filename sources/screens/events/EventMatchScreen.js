import { BlurView } from "expo-blur";
import React, { useCallback, useMemo } from "react";
import { Dimensions, Keyboard, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AnimatedTransitionView } from "../../components/animations";
import { IconButton } from "../../components/buttons";
import { JoinEventState, MatchedState } from "../../components/eventsMatches";
import { EventCoverPreview } from "../../components/images";
import { MainText } from "../../components/texts";
import { BounceView, LiveDot } from "../../components/views";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useEventActivity, useTheme } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { icons, insets } from "../../styles";
import { BORDER_RADIUS } from "../../styles/sizes";

const { width, height } = Dimensions.get("window");

const ANIMATION_DAMPING = 16;
const CLOSE_SNAP_POINT = height * 0.08;

const EventMatchScreen = ({ onDetailPress, translateY }) => {
  const theme = useTheme();

  const {
    event,
    isLoading,
    isMatchStarted,
    matchProfile,

    leaveEvent,
    startMatch,
  } = useEventActivity();

  /* Methods */

  const closeSheet = () => {
    translateY.value = withSpring(height * 1.1, {
      mass: 0.4,
      damping: ANIMATION_DAMPING,
    });
  };

  /* Callbacks */

  const onEventDetailPress = useCallback(() => {
    closeSheet();

    setTimeout(() => {
      onDetailPress?.(event.id);
    }, 100);
  }, []);

  const onMorePress = () => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: {
        type: actiontypes.MENU_MODAL.EVENT_MATCH,
        onLeftPress: () => {
          closeSheet();

          leaveEvent();
        },
      },
    });
  };

  const onStartMatchPress = () => {
    startMatch();
  };

  const onMatchProfiledPress = () => {
    closeSheet();

    setTimeout(() => {
      pushNavigation({
        componentId,
        screen: SCREENS.Profile,
        passProps: { user: matchProfile },
      });
    }, 100);
  };

  /* Animations */

  const panGesture = Gesture.Pan()
    .onChange(({ translationY, velocityY }) => {
      if (velocityY <= 0 && translateY.value <= 8) {
        return;
      }

      translateY.value = translationY;

      runOnJS(Keyboard.dismiss)();
    })
    .onEnd(({ translationY }) => {
      if (translationY < CLOSE_SNAP_POINT) {
        translateY.value = withSpring(0, { damping: ANIMATION_DAMPING });
      } else {
        runOnJS(closeSheet)();
      }
    });

  /* Props */

  const containerStyle = useMemo(() => {
    return [
      styles.container,
      { backgroundColor: theme.colors.second_background },
    ];
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        {
          scale: interpolate(
            translateY.value,
            [0, height / 2],
            [1, 0.94],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[containerStyle, containerAnimatedStyle]}>
        {/* Top Bar */}

        <View style={styles.topBar}>
          <IconButton
            inset={1}
            onPress={closeSheet}
            source={icons.Chevrons.Down}
          />

          <BounceView
            onPress={onEventDetailPress}
            style={{ flex: 1, marginHorizontal: 16 }}
          >
            <MainText align="center" numberOfLines={1} font="title-7">
              {event?.title}
            </MainText>
          </BounceView>

          <IconButton onPress={onMorePress} inset={2} source={icons.More} />
        </View>

        {/* Content */}

        <View
          style={{
            alignItems: "center",
            marginHorizontal: 16,
          }}
        >
          <View>
            <View>
              <EventCoverPreview
                scale={0.92}
                ignoreRatio
                event={event}
                disabledAnimation
                onPress={onEventDetailPress}
              >
                <View style={styles.coverOverlay}>
                  <BlurView tint="dark" style={styles.liveDot}>
                    <LiveDot style={{ height: 24 }} />
                  </BlurView>
                </View>
              </EventCoverPreview>
            </View>

            <JoinEventState isLoading={isLoading} onPress={onStartMatchPress} />
          </View>

          <AnimatedTransitionView
            isVisible={isMatchStarted}
            style={styles.content}
          >
            <MatchedState onProfilePress={onMatchProfiledPress} />
          </AnimatedTransitionView>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default EventMatchScreen;

const styles = StyleSheet.create({
  container: {
    width,
    height: height,
    bottom: 0,
    position: "absolute",
    zIndex: 1,
    paddingTop: insets.top + 8,
    borderRadius: BORDER_RADIUS,
  },
  content: {
    position: "absolute",
    width: "100%",
    height: "110%",
    top: -8,
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    marginBottom: "6%",
    alignItems: "center",
    paddingHorizontal: "4%",
  },
  liveDot: {
    padding: 12,
    borderRadius: 20,
    overflow: "hidden",
  },
  coverOverlay: {
    bottom: 12,
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "flex-end",
  },
});

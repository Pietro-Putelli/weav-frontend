import React, { forwardRef, memo, useCallback, useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEventActivity, useTheme } from "../../hooks";
import { EventMatchScreen, HomeScreen } from "../../screens";
import mergeRefs from "../../utility/mergeRefs";
import { BottomTabBar } from "../navigation";
import { pushNavigation } from "../../navigation/actions";
import { SCREENS } from "../../constants/screens";

const { width, height } = Dimensions.get("window");
const INITIAL_SHEET_Y = height * 1.1;

const RootTabContainer = forwardRef(
  ({ children, onChangeTab, states, ...props }, ref) => {
    const theme = useTheme();
    const scrollRef = useRef();

    componentId = props.componentId;

    const scrollX = useSharedValue(width);
    const eventMatchY = useSharedValue(INITIAL_SHEET_Y);

    const { hasOngoingEvent } = useEventActivity();

    const [isEventSheetInitialezed, setIsEventSheetInitialezed] =
      useState(false);

    /* States */

    const { selected, setSelected } = states;

    /* Callbacks */

    const onTabPress = (index) => {
      setSelected(index);
      onChangeTab(index);
    };

    const onShowCurrentEnvetMatch = useCallback(() => {
      eventMatchY.value = withSpring(0, { damping: 16, mass: 0.5 }, () => {
        if (!isEventSheetInitialezed) {
          runOnJS(setIsEventSheetInitialezed)(true);
        }
      });
    }, [isEventSheetInitialezed]);

    const onEventDetailPress = useCallback((eventId) => {
      pushNavigation({
        componentId,
        screen: SCREENS.EventDetail,
        passProps: { eventId },
      });
    }, []);

    const tabs = children.props.children ?? [];

    /* Styles */

    const bottomBarAnimatedStyle = useAnimatedStyle(() => {
      let translateY = 0;

      if (hasOngoingEvent) {
        translateY = interpolate(
          eventMatchY.value,
          [0, INITIAL_SHEET_Y],
          [200, 0]
        );
      }

      return { transform: [{ translateY }] };
    });

    return (
      <View style={theme.styles.container}>
        <ScrollView
          horizontal
          ref={mergeRefs([scrollRef, ref])}
          scrollEnabled={false}
          contentInsetAdjustmentBehavior="never"
        >
          <HomeScreen onChangeTab={onChangeTab} scrollX={scrollX} {...props} />

          {tabs.map((Tab, index) => {
            return <TabScreenContainer key={index}>{Tab}</TabScreenContainer>;
          })}
        </ScrollView>

        {hasOngoingEvent && (
          <EventMatchScreen
            translateY={eventMatchY}
            onDetailPress={onEventDetailPress}
            isEventSheetInitialezed={isEventSheetInitialezed}
          />
        )}

        <Animated.View style={bottomBarAnimatedStyle}>
          <BottomTabBar
            scrollX={scrollX}
            onPress={onTabPress}
            componentId={componentId}
            onChangeTabTab={onChangeTab}
            states={{ selected, setSelected }}
            onCurrentEventPress={onShowCurrentEnvetMatch}
          />
        </Animated.View>
      </View>
    );
  }
);

export default memo(RootTabContainer);

const TabScreenContainer = ({ children }) => {
  return <View style={{ width, height }}>{children}</View>;
};

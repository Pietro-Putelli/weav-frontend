import { isEmpty } from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { MomentLocationHeader } from "../../components/headers";
import { AdvancedFlatList } from "../../components/lists";
import { EventCell } from "../../components/moments";
import {
  LocationPermissionPlaceholder,
  MomentsPlaceholder,
} from "../../components/placeholders";
import { TutorialBadgeView } from "../../components/tutorials";
import { eventlisteners, querylimits } from "../../constants";
import {
  useCurrentLocation,
  useEventListener,
  useEvents,
  useTheme,
  useUser,
} from "../../hooks";
import {
  getTutorialState,
  setTutorial,
} from "../../store/slices/settingsReducer";
import {
  FLOATING_HEADER_PADDING_TOP,
  MomentCellSize,
  TAB_BAR_HEIGHT,
} from "../../styles/sizes";

const EVENT_MOMENTS_LIST = querylimits.EIGHT;

const { height } = Dimensions.get("window");
const GRADIENT_HEIGHT = (height - MomentCellSize.height) / 2;

const EventsScreen = ({ onChangeTab, isFocused, componentId }) => {
  /* States */
  const {
    events,
    isLoading,
    isNotFound,
    isRefreshing,
    isChanging,
    fetchEvents,
    refreshEvents,
  } = useEvents();

  const { hasLocationPermission } = useUser();

  const isListVisible = !isChanging && hasLocationPermission;

  /* Utility hooks */

  const theme = useTheme();
  const scrollRef = useRef();
  const scrollY = useSharedValue(0);
  const dispatch = useDispatch();
  const offset = useRef(0);

  /* Tutorial Stuffs */

  const { events: eventsTutorial } = useSelector(getTutorialState);

  const isEventTutorialVisible =
    isFocused && !eventsTutorial && !isEmpty(events);

  const setTutorialVisible = () => {
    dispatch(setTutorial({ events: true }));
  };

  /* Effects */

  useCurrentLocation(() => {
    offset.current = 0;
  });

  useEventListener(
    { identifier: eventlisteners.EVENT_MOMENTS },
    () => {
      scrollToTop();
    },
    []
  );

  /* Methods */

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  /* Callbacks */

  const onRefresh = useCallback(() => {
    offset.current = 0;

    refreshEvents();
  }, []);

  const onEndReached = () => {
    offset.current += EVENT_MOMENTS_LIST;

    fetchEvents(offset.current);
  };

  /* Styles */

  const containerStyle = useMemo(() => {
    return {
      ...styles.container,
      backgroundColor: theme.colors.background,
    };
  }, []);

  /* Components */

  const renderItem = useCallback(({ item, index }) => {
    return (
      <EventCell
        moment={item}
        index={index}
        scrollY={scrollY}
        componentId={componentId}
        onReposted={setTutorialVisible}
      />
    );
  }, []);

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return (
        <MomentsPlaceholder
          isEvent
          componentId={componentId}
          onChangeTab={onChangeTab}
        />
      );
    }

    return null;
  }, [isNotFound]);

  const scrollContentStyle = useMemo(() => {
    return {
      paddingBottom: TAB_BAR_HEIGHT + 16,
      paddingTop: isEmpty(events) ? 0 : FLOATING_HEADER_PADDING_TOP,
    };
  }, [events]);

  return (
    <>
      <View style={containerStyle}>
        <MomentLocationHeader
          componentId={componentId}
          onHeaderPress={scrollToTop}
        />

        {isListVisible && (
          <AdvancedFlatList
            data={events}
            ref={scrollRef}
            scrollY={scrollY}
            itemSize={height / 2}
            onRefresh={onRefresh}
            isLoading={isLoading}
            renderItem={renderItem}
            extraData={events}
            onEndReached={onEndReached}
            isRefreshing={isRefreshing}
            onEndReachedThreshold={0.5}
            bulkCount={EVENT_MOMENTS_LIST}
            drawDistance={2000}
            ListEmptyComponent={ListEmptyComponent}
            estimatedItemSize={MomentCellSize.height}
            contentContainerStyle={scrollContentStyle}
          />
        )}

        {!hasLocationPermission && <LocationPermissionPlaceholder />}
      </View>

      <TutorialBadgeView
        type="events"
        setVisible={setTutorialVisible}
        visible={isEventTutorialVisible}
      />
    </>
  );
};
export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom_gradient: {
    position: "absolute",
    bottom: 0,
    zIndex: 2,
    width: "100%",
    height: GRADIENT_HEIGHT,
  },
  navigationButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

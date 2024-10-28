import { isEmpty } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmView, ErrorBadgeView } from "../../components/badgeviews";
import { MomentLocationHeader } from "../../components/headers";
import { AdvancedFlatList } from "../../components/lists";
import { MomentCell } from "../../components/moments";
import {
  LocationPermissionPlaceholder,
  MomentsPlaceholder,
} from "../../components/placeholders";
import { TutorialBadgeView } from "../../components/tutorials";
import { ScrollDirections, eventlisteners } from "../../constants";
import {
  useCurrentLocation,
  useEventListener,
  useLanguages,
  useUser,
  useUserMoments,
} from "../../hooks";
import {
  getTutorialState,
  setTutorial,
} from "../../store/slices/settingsReducer";
import {
  FLOATING_HEADER_PADDING_TOP,
  MediaCellSize,
  TAB_BAR_HEIGHT,
} from "../../styles/sizes";

const MomentsScreen = ({ isFocused, componentId }) => {
  const dispatch = useDispatch();

  /* States */
  const {
    moments,
    refreshMoments,
    fetchMoments,
    isLoading,
    isRefreshing,
    isNotFound,
    isChanging,
  } = useUserMoments();

  const { hasLocationPermission, userId } = useUser();

  const [visibleBadge, setVisibleBadge] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [hasAlreadyReplied, setHasAlreadyReplied] = useState(false);

  /* Utility */

  const offset = useRef(0);
  const scrollRef = useRef();
  const scrollY = useSharedValue(0);
  const { languageContent } = useLanguages();

  /* Tutorial Stuffs */

  const { moments: momentsTutorial } = useSelector(getTutorialState);

  const isMomentTutorialVisible = useMemo(() => {
    const userMoments = moments.filter((moment) => moment.user.id !== userId);

    return !momentsTutorial && !isEmpty(userMoments);
  }, [moments, momentsTutorial]);

  const setTutorialVisible = () => {
    dispatch(setTutorial({ moments: true }));
  };

  /* Effects */

  useCurrentLocation(() => {
    offset.current = 0;
  });

  useEventListener(
    { identifier: eventlisteners.HOME_SCREEN },
    () => {
      scrollToTop();
    },
    [isFocused]
  );

  /* Props */

  const contentContainerStyle = useMemo(() => {
    if (isEmpty(moments)) {
      return { paddingBottom: 0 };
    }

    return { ...styles.scrollContent, paddingBottom: TAB_BAR_HEIGHT + 16 };
  }, [moments]);

  const isListVisible = !isChanging && hasLocationPermission;

  /* Callbacks */

  const onEndReached = useCallback(() => {
    offset.current += 8;

    fetchMoments({ offset: offset.current });
  }, []);

  const onRefresh = useCallback(() => {
    offset.current = 0;

    refreshMoments();
  }, []);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const onMomentReacted = useCallback(
    (alreadyReplied) => {
      if (isMomentTutorialVisible) {
        setTutorialVisible();
      }

      if (!alreadyReplied) {
        setVisibleBadge(true);
      } else {
        setHasAlreadyReplied(true);
      }
    },
    [isMomentTutorialVisible]
  );

  const onChangeDirection = useCallback(
    (direction) => {
      const isDirectionUp = direction === ScrollDirections.UP;

      if (isHeaderVisible !== isDirectionUp) {
        setIsHeaderVisible(direction === ScrollDirections.UP);
      }
    },
    [isHeaderVisible]
  );

  /* Components */

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View style={{ marginLeft: 6 }}>
          <MomentCell
            moment={item}
            index={index}
            componentId={componentId}
            onMomentReacted={onMomentReacted}
          />
        </View>
      );
    },
    [moments, onMomentReacted]
  );

  const renderEmptyOverlay = useCallback(() => {
    if (isNotFound) {
      return <MomentsPlaceholder />;
    }

    return null;
  }, [isNotFound]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <MomentLocationHeader
          isMoments
          componentId={componentId}
          onHeaderPress={scrollToTop}
          isVisible={isHeaderVisible}
        />

        {isListVisible && (
          <AdvancedFlatList
            data={moments}
            bulkCount={8}
            ref={scrollRef}
            enabledAnimation
            scrollY={scrollY}
            drawDistance={2000}
            extraData={moments}
            isLoading={isLoading}
            onRefresh={onRefresh}
            renderItem={renderItem}
            onEndReached={onEndReached}
            isRefreshing={isRefreshing}
            estimatedItemSize={MediaCellSize.minHeight}
            ListEmptyComponent={renderEmptyOverlay()}
            contentContainerStyle={contentContainerStyle}
            layoutAnimationIdentifier={eventlisteners.HOME_SCREEN_LAYOUT}
            onChangeDirection={onChangeDirection}
          />
        )}

        {!hasLocationPermission && <LocationPermissionPlaceholder />}

        <ConfirmView
          visible={visibleBadge}
          setVisible={setVisibleBadge}
          title={languageContent.actions.sent}
        />

        <ErrorBadgeView
          visible={hasAlreadyReplied}
          setVisible={setHasAlreadyReplied}
          title={languageContent.already_replied}
        />
      </View>

      <TutorialBadgeView
        type="moments"
        setVisible={setTutorialVisible}
        visible={isMomentTutorialVisible}
      />
    </>
  );
};

export default MomentsScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: FLOATING_HEADER_PADDING_TOP,
  },
});

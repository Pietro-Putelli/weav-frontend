import _, { isEmpty } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FadeAnimatedView } from "../../components/animations";
import { BadgeButton } from "../../components/buttons";
import { VenueCell } from "../../components/cells";
import { HeaderTitle } from "../../components/headers";
import { AdvancedFlatList } from "../../components/lists";
import { VenuesPlaceholder } from "../../components/placeholders";
import { VenuesSelector } from "../../components/selectors";
import { TutorialBadgeView } from "../../components/tutorials";
import { LoaderView } from "../../components/views";
import { ScrollDirections, eventlisteners, querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useEventListener, useLanguages, useTheme, useUser } from "../../hooks";
import useBusinesses, {
  INITIAL_FETCH_OPTIONS,
} from "../../hooks/useBusinesses";
import { showModalNavigation } from "../../navigation/actions";
import {
  clearBusinesses,
  setFilteredBusinesses,
} from "../../store/slices/businessesReducer";
import {
  getTutorialState,
  setTutorial,
} from "../../store/slices/settingsReducer";
import { icons, insets } from "../../styles";
import {
  TAB_BAR_HEIGHT,
  VENUE_CELL_HEIGHT,
  VENUE_TYPES_SELECTOR_HEIGHT,
} from "../../styles/sizes";

VENUES_LIMIT = querylimits.SIX;

const BusinessListScreen = ({ componentId }) => {
  /* Utility hooks */

  const theme = useTheme();
  const listRef = useRef();
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  /* States */

  const { city } = useUser();

  const {
    businesses,
    isLoading,
    isRefreshing,
    isChangingType,
    hasFilters,
    isNotFound,
    fetchOptions,
    updateFetchOptions,
  } = useBusinesses();

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEventListener(
    { identifier: eventlisteners.VENUE_SCREEN },
    () => {
      scrollToStart();
    },
    []
  );

  /* Tutorial Stuffs */

  const { venues: venuesTutorial } = useSelector(getTutorialState);

  const isVenueTutorialVisible = !venuesTutorial && !isEmpty(businesses);

  const setTutorialVisible = () => {
    dispatch(setTutorial({ venues: true }));
  };

  /* Methods */

  const scrollToStart = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const scrollToStartAndAnimateLayout = () => {
    scrollToStart();

    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  /* Callbacks */

  const onOptionsChanged = useCallback(
    (options) => {
      updateFetchOptions({ ...options, offset: 0 });
    },
    [fetchOptions, updateFetchOptions]
  );

  const onVenueTypeChanged = useCallback(
    (venueTypeId) => {
      if (!isHeaderVisible) {
        setIsHeaderVisible(true);
      }

      if (fetchOptions.type !== venueTypeId) {
        dispatch(clearBusinesses());

        if (venueTypeId == -1) {
          onClearFiltersPress();
        } else {
          updateFetchOptions({
            ...INITIAL_FETCH_OPTIONS,
            closed_too: fetchOptions.closed_too,
            type: venueTypeId,
          });
        }
      }

      setTimeout(() => {
        scrollToStartAndAnimateLayout();
      }, 400);
    },
    [fetchOptions, isHeaderVisible, updateFetchOptions]
  );

  const onClearFiltersPress = useCallback(() => {
    updateFetchOptions(INITIAL_FETCH_OPTIONS);

    dispatch(setFilteredBusinesses(null));
  }, [fetchOptions]);

  const onEndReached = useCallback(() => {
    updateFetchOptions({ offset: fetchOptions.offset + VENUES_LIMIT });
  }, [fetchOptions]);

  const onChangeDirection = useCallback(
    (direction) => {
      const isDirectionUp = direction === ScrollDirections.UP;

      if (isHeaderVisible !== isDirectionUp) {
        setIsHeaderVisible(direction == ScrollDirections.UP);
      }
    },
    [isHeaderVisible]
  );

  const onPlaceholderPress = useCallback(() => {
    if (hasFilters) {
      onClearFiltersPress();
    } else {
      updateFetchOptions({ closed_too: true });
    }
  }, [hasFilters, fetchOptions]);

  const onRefresh = useCallback(() => {
    updateFetchOptions({ offset: 0 });
  }, [fetchOptions]);

  /* Components */

  const renderFilterButton = useCallback(() => {
    let count = 0;

    const { filters, price_target, closed_too } = fetchOptions;

    if (!_.isEmpty(filters)) {
      count += 1;
    }

    if (price_target != 0) {
      count += 1;
    }

    if (closed_too) {
      count += 1;
    }

    return (
      <BadgeButton
        inset={2}
        count={count}
        source={icons.Settings}
        onPress={() => {
          showModalNavigation({
            screen: SCREENS.VenueFilter,
            passProps: { options: fetchOptions, onOptionsChanged },
          });
        }}
      />
    );
  }, [fetchOptions, onOptionsChanged]);

  /* Props */

  const headerProps = useMemo(() => {
    return {
      title: `${languageContent.header_titles.venues_in} ${city}`,
      rightButton: renderFilterButton,
      style: { backgroundColor: theme.colors.background },
    };
  }, [fetchOptions, city, languageContent]);

  /* Components */

  const renderItem = useCallback(
    ({ item: venue }) => {
      return (
        <VenueCell
          venue={venue}
          componentId={componentId}
          onReposted={setTutorialVisible}
        />
      );
    },
    [businesses]
  );

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return (
        <VenuesPlaceholder
          hasFilters={hasFilters}
          onPress={onPlaceholderPress}
        />
      );
    }

    return null;
  }, [isNotFound, hasFilters, onPlaceholderPress]);

  return (
    <>
      <View style={styles.flex}>
        <HeaderTitle {...headerProps} />

        <FadeAnimatedView style={styles.flex}>
          <VenuesSelector
            hasFilters={hasFilters}
            isVisible={isHeaderVisible}
            selected={fetchOptions.type}
            onChange={onVenueTypeChanged}
          />

          {!isChangingType ? (
            <AdvancedFlatList
              ref={listRef}
              enabledAnimation
              data={businesses}
              drawDistance={2000}
              onRefresh={onRefresh}
              isLoading={isLoading}
              renderItem={renderItem}
              bulkCount={VENUES_LIMIT}
              extraData={businesses}
              onEndReached={onEndReached}
              isRefreshing={isRefreshing}
              onEndReachedThreshold={0.5}
              onChangeDirection={onChangeDirection}
              estimatedItemSize={VENUE_CELL_HEIGHT}
              ListEmptyComponent={ListEmptyComponent}
              contentContainerStyle={styles.contentContainerStyle}
            />
          ) : (
            <View style={styles.loader}>
              <LoaderView />
            </View>
          )}
        </FadeAnimatedView>
      </View>
      <TutorialBadgeView
        type="venues"
        setVisible={setTutorialVisible}
        visible={isVenueTutorialVisible}
      />
    </>
  );
};

export default BusinessListScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: insets.bottom,
  },
  footer: {
    paddingTop: 8,
    alignItems: "center",
  },
  header: {
    height: VENUE_TYPES_SELECTOR_HEIGHT + 4,
  },
  contentContainerStyle: {
    paddingTop: VENUE_TYPES_SELECTOR_HEIGHT + 4,
    paddingBottom: insets.bottom + 16,
  },
});

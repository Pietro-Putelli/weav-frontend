import { size } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import SpotsAPI from "../../backend/spots";
import { ConfirmView } from "../../components/badgeviews";
import { HeaderFlatList } from "../../components/containers";
import { MomentSpotsPlaceholder } from "../../components/placeholders";
import { SpotCell, VenueSpotsList } from "../../components/spots";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useBusinesses, useLanguages, useSpots, useUser } from "../../hooks";
import { BUSINESS_TYPE } from "../../hooks/useBusinesses";
import { showStackModal } from "../../navigation/actions";
import { setTutorial } from "../../store/slices/settingsReducer";
import { icons } from "../../styles";
import { MediaCellSize } from "../../styles/sizes";
import { isAndroidDevice } from "../../utility/functions";

const BUSINESS_LIMIT = querylimits.EIGHT;

const isAndroid = isAndroidDevice();

const SpotsScreen = ({ componentId }) => {
  /* States */

  const {
    spots,
    isLoading: isLoadingSpots,
    appendSpot,
    fetchSpots,
    removeSpot,
    replyToSpot,
  } = useSpots();

  const {
    businesses,
    isLoading: isLoadingBusinesses,
    isNotFound: isBusinessesNotFound,
    fetchBusinesses,
    removeBusiness,
  } = useBusinesses({ type: BUSINESS_TYPE.SPOTS });

  const [fetchOptions, setFetchOptions] = useState({
    businessOffset: 0,
    spotOffset: 0,
    businessId: null,
  });

  const currentBusinessId = fetchOptions.businessId;

  const { businessId } = fetchOptions;

  const { isLoading } = useMemo(() => {
    return {
      isLoading: isLoadingSpots || isLoadingBusinesses,
    };
  }, [isLoadingSpots, isLoadingBusinesses]);

  const [visibleBadge, setVisibleBadge] = useState(false);

  const { city, userId } = useUser();

  const { languageContent, locale } = useLanguages();

  const carouselRef = useRef();
  const dispatch = useDispatch();

  /* Effects */

  useEffect(() => {
    _fetchSpots();

    dispatch(setTutorial({ spots: true }));
  }, []);

  /* Methods */

  const _fetchSpots = (callback) => {
    fetchBusinesses(fetchOptions, (businesses) => {
      const business = businesses?.[0];

      if (business) {
        updateFetchOptions({ businessId: business.id });

        callback?.(businesses);
      }
    });
  };

  const appendCallback = ({ spot, businesses }) => {
    const index = businesses.findIndex(
      (business) => business.id === spot.business_id
    );

    setTimeout(() => {
      carouselRef.current?.scrollToIndex({
        index: Math.max(0, index),
        animated: true,
      });
    }, 200);
  };

  const onCreatedSpot = (spot) => {
    const business = businesses.find(
      (business) => business.id === spot.business_id
    );

    if (!business) {
      _fetchSpots((businesses) => {
        appendCallback({ spot, businesses });
      });
    } else if (business.id === currentBusinessId) {
      appendSpot({ spot, business });
    } else {
    }
  };

  const onDeletedSpot = (spot) => {
    removeSpot(spot);

    if (size(spots) === 1) {
      removeBusiness(spot.business_id);
    }

    _fetchSpots();
  };

  const onSpotSwiped = useCallback(
    (spot) => {
      setVisibleBadge(true);

      SpotsAPI.reply(spot.id, (isReplied) => {
        if (isReplied) {
          replyToSpot(spot);
        }
      });
    },
    [replyToSpot]
  );

  const updateFetchOptions = (options) => {
    const newOptions = { ...fetchOptions, ...options };

    setFetchOptions(newOptions);

    fetchSpots(newOptions);
  };

  /* Props */

  const headerProps = useMemo(() => {
    return {
      title: `Spots ${locale == "it" ? "a" : "in"} ${city}`,
    };
  }, []);

  const floatingButtonProps = useMemo(() => {
    if (isBusinessesNotFound || isLoadingBusinesses) {
      return null;
    }

    return {
      icon: icons.Add,
      onPress: () => {
        showStackModal({
          screen: SCREENS.CreateSpot,
          passProps: { onCreated: onCreatedSpot },
        });
      },
    };
  }, [
    isBusinessesNotFound,
    isLoadingBusinesses,
    onCreatedSpot,
    currentBusinessId,
  ]);

  /* Callbacks */

  const onSnapToVenue = useCallback(
    ({ item }) => {
      if (fetchOptions.businessId !== item.id) {
        updateFetchOptions({ businessId: item.id });
      }
    },
    [fetchOptions]
  );

  const onEndVenuesReached = useCallback(() => {
    updateFetchOptions({
      businessOffset: fetchOptions.businessOffset + BUSINESS_LIMIT,
    });
  }, [fetchOptions]);

  const onEndSpotsReached = useCallback(() => {
    updateFetchOptions({ spotOffset: fetchOptions.spotOffset + 8 });
  }, [fetchOptions]);

  const onVenuePress = ({ venue }) => {
    if (isAndroid) {
      const venueId = venue.id;

      if (fetchOptions.businessId !== venueId) {
        updateFetchOptions({ businessId: venueId });
      }
    }
  };

  /* Components */

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <SpotCell
          spot={item}
          onSwiped={onSpotSwiped}
          onDeleted={onDeletedSpot}
          componentId={componentId}
        />
      );
    },
    [spots, onSpotSwiped]
  );

  const ListEmptyComponent = useMemo(() => {
    if (isBusinessesNotFound) {
      return (
        <MomentSpotsPlaceholder
          onCreatedSpot={onCreatedSpot}
          style={{ marginTop: 0 }}
        />
      );
    }

    return null;
  }, [isBusinessesNotFound, onCreatedSpot, currentBusinessId]);

  const ListHeaderComponent = useMemo(() => {
    if (isBusinessesNotFound || isLoadingBusinesses) {
      return null;
    }

    return (
      <VenueSpotsList
        ref={carouselRef}
        venues={businesses}
        onPress={onVenuePress}
        componentId={componentId}
        selectedVenueId={businessId}
        onSnapToVenue={onSnapToVenue}
        onEndReached={onEndVenuesReached}
      />
    );
  }, [isLoadingBusinesses, businesses, businessId, isBusinessesNotFound]);

  return (
    <View style={styles.container}>
      <HeaderFlatList
        data={spots}
        enabledAnimation
        isLoading={isLoading}
        renderItem={renderItem}
        headerProps={headerProps}
        bulkCount={querylimits.EIGHT}
        onEndReached={onEndSpotsReached}
        contentStyle={styles.listContent}
        ListEmptyComponent={ListEmptyComponent}
        floatingButtonProps={floatingButtonProps}
        ListHeaderComponent={ListHeaderComponent}
        estimatedItemSize={MediaCellSize.minHeight}
      />

      <ConfirmView
        visible={visibleBadge}
        setVisible={setVisibleBadge}
        title={languageContent.its_me}
      />
    </View>
  );
};

export default SpotsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  separator: { marginLeft: 12 },
  listContent: { paddingHorizontal: 0 },
});

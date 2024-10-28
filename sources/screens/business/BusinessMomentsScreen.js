import React, { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { ConfirmView, ErrorBadgeView } from "../../components/badgeviews";
import { HeaderFlatList } from "../../components/containers";
import { MomentCell } from "../../components/moments";
import { BusinessMomentsPlaceholder } from "../../components/placeholders";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useBusinessMoments, useLanguages } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";

const BusinessMomentsScreen = ({ business, componentId }) => {
  const offset = useRef(0);

  const {
    moments,
    isMomentsEmpty,
    isLoading,
    isRefreshing,
    isNotFound,

    fetchMoments,
    appendMoment,
    removeMoment,
  } = useBusinessMoments({ businessId: business.id });

  const [hasAlreadyReplied, setHasAlreadyReplied] = useState(false);
  const [visibleBadge, setVisibleBadge] = useState(false);

  const { languageContent, locale } = useLanguages();

  /* Callbacks */

  const onCreateMomentPress = useCallback(() => {
    showStackModal({
      screen: SCREENS.CreateMoment,
      passProps: {
        initialMoment: {
          business_tag: business,
        },
        businessDisabled: true,
        onCreated: appendMoment,
      },
    });
  }, [business, moments]);

  const onEndReached = useCallback(() => {
    offset.current = offset.current + 8;

    fetchMoments(offset.current);
  }, [moments]);

  const onRefresh = useCallback(() => {
    offset.current = 0;

    fetchMoments();
  }, [moments]);

  const onMomentReacted = useCallback((alreadyReplied) => {
    if (!alreadyReplied) {
      setVisibleBadge(true);
    } else {
      setHasAlreadyReplied(true);
    }
  }, []);

  const onMomentDeleted = useCallback((moment) => {
    removeMoment(moment.id);
  }, []);

  /* Props */

  const headerProps = useMemo(() => {
    return {
      title: `${languageContent.people_in} ${business?.name}`,
    };
  }, []);

  const floatingButtonProps = useMemo(() => {
    if (isMomentsEmpty) {
      return null;
    }

    return {
      icon: icons.Add,
      onPress: onCreateMomentPress,
    };
  }, [isMomentsEmpty, onCreateMomentPress]);

  /* Render */

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View style={{ marginLeft: 6 }}>
          <MomentCell
            moment={item}
            index={index}
            hideBusinessImage
            componentId={componentId}
            onMomentReacted={onMomentReacted}
            onDeleted={() => onMomentDeleted(item)}
          />
        </View>
      );
    },
    [moments, onMomentReacted]
  );

  const renderEmptyComponent = useCallback(() => {
    if (isNotFound) {
      let placeholderTitle = "";

      if (locale == "it") {
        placeholderTitle = languageContent.placeholders.no_spots_yet;
      } else {
        placeholderTitle =
          languageContent.placeholders.no_spots_yet_1 +
          " " +
          business?.name +
          " " +
          languageContent.placeholders.no_spots_yet_2;
      }

      return (
        <BusinessMomentsPlaceholder
          onPress={onCreateMomentPress}
          business={business}
        />
      );
    }

    return null;
  }, [isNotFound]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderFlatList
        data={moments}
        removeMargin
        enabledAnimation
        isLoading={isLoading}
        renderItem={renderItem}
        estimatedItemSize={200}
        headerProps={headerProps}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        bulkCount={querylimits.EIGHT}
        floatingButtonProps={floatingButtonProps}
        renderEmptyComponent={renderEmptyComponent}
      />

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
  );
};

export default BusinessMomentsScreen;

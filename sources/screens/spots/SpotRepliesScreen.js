import React, { useCallback, useMemo, useRef } from "react";
import { FadeAnimatedView } from "../../components/animations";
import {
  HorizontalUserProfileCell,
  SingleTitleCell,
} from "../../components/cells";
import { HeaderFlatList } from "../../components/containers";
import { MainText } from "../../components/texts";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useSpots } from "../../hooks";
import { SPOTS_MODE } from "../../hooks/useSpots";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";

const BULK_COUNT = querylimits.EIGHT;

const SpotRepliesScreen = ({ componentId, spotId }) => {
  const { replyResponse, fetchReplies, isLoading, isNotFound } = useSpots({
    spotId,
    mode: SPOTS_MODE.REPLIES,
  });

  const { replies, count, business } = replyResponse;

  const offset = useRef(0);

  const { languageContent, getPluralAwareWord } = useLanguages();

  const onEndReached = useCallback(() => {
    offset.current += BULK_COUNT;

    fetchReplies(offset.current);
  }, []);

  const onUserPress = (user) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user, isModal: true },
    });
  };

  const onBusinessPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.VenueDetail,
      passProps: { initialBusiness: business },
    });
  };

  const renderItem = useCallback(({ item }) => {
    return <HorizontalUserProfileCell onPress={onUserPress} user={item} />;
  }, []);

  const ListEmptyComponent = useMemo(() => {
    if (isNotFound) {
      return (
        <FadeAnimatedView style={{ alignItems: "center", marginTop: 8 }}>
          <MainText font="subtitle">{languageContent.no_replies_yet}</MainText>
        </FadeAnimatedView>
      );
    }

    return null;
  }, [isNotFound]);

  const headerProps = useMemo(() => {
    return {
      title: count + " " + getPluralAwareWord({ word: "reply", count }),
    };
  }, [count]);

  const renderHeader = () => {
    if (!business) return null;

    return (
      <FadeAnimatedView mode="fade-up">
        <SingleTitleCell
          coloredIcon
          title={business?.name}
          icon={icons.ColoredMarker}
          style={{ marginTop: 0, marginBottom: "6%" }}
          onPress={onBusinessPress}
        />
      </FadeAnimatedView>
    );
  };

  return (
    <HeaderFlatList
      data={replies}
      enabledAnimation
      isLoading={isLoading}
      bulkCount={BULK_COUNT}
      renderItem={renderItem}
      estimatedItemSize={100}
      headerProps={headerProps}
      onEndReached={onEndReached}
      renderHeader={renderHeader}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

export default SpotRepliesScreen;

import { isEmpty, unionBy } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import SpotsAPI from "../../backend/spots";
import { FadeAnimatedView } from "../../components/animations";
import { ConfirmView } from "../../components/badgeviews";
import { HeaderFlatList } from "../../components/containers";
import { SquareImage } from "../../components/images";
import { ImageTitlePlaceholder } from "../../components/placeholders";
import { SpotCell } from "../../components/spots";
import { MainText } from "../../components/texts";
import { querylimits } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useSpots, useTheme } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";

const BusinessSpotsScreen = ({ business, componentId }) => {
  const offset = useRef(0);
  const theme = useTheme();

  const [visibleBadge, setVisibleBadge] = useState(false);

  const businessId = business.id;

  const { spots, setSpots, fetchSpots, replyToSpot, isLoading, isNotFound } =
    useSpots({
      businessId,
    });

  const isSpotsEmpty = isEmpty(spots);

  const { languageContent, locale } = useLanguages();

  const onCreateSpotPress = useCallback(() => {
    showStackModal({
      screen: SCREENS.CreateSpot,
      passProps: {
        initialSpot: { business },
        onCreated: (spot) => {
          if (businessId === spot.business_id) {
            setSpots((spots) => {
              return unionBy([spot], spots, "id");
            });
          }
        },
      },
    });
  }, [business]);

  const onDeleted = useCallback((spot) => {
    setSpots((spots) => {
      return spots.filter((s) => s.id !== spot.id);
    });
  }, []);

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

  const onEndReached = useCallback(() => {
    offset.current = offset.current + 8;

    fetchSpots(offset.current);
  }, []);

  const headerProps = useMemo(() => {
    return {
      title: `Spots in ${business?.name}`,
    };
  }, []);

  const floatingButtonProps = useMemo(() => {
    if (isSpotsEmpty) {
      return null;
    }

    return {
      icon: icons.Add,
      onPress: onCreateSpotPress,
    };
  }, [isSpotsEmpty, onCreateSpotPress]);

  /* Render */

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <SpotCell
          spot={item}
          onDeleted={onDeleted}
          onSwiped={onSpotSwiped}
          componentId={componentId}
        />
      );
    },
    [onDeleted, onSpotSwiped]
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
        <ImageTitlePlaceholder
          buttonTitle={languageContent.buttons.spot_someone}
          icon={icons.ColoredSpots}
          onPress={onCreateSpotPress}
        >
          {placeholderTitle}
        </ImageTitlePlaceholder>
      );
    }

    return null;
  }, [isNotFound]);

  const renderHeader = () => {
    if (!isNotFound && !isLoading) {
      return (
        <FadeAnimatedView
          mode="fade-up"
          style={[theme.styles.shadow_round, styles.headerContianer]}
        >
          <SquareImage source={icons.Idea} coloredIcon />
          <MainText font="subtitle-1" bold style={{ marginLeft: 8 }}>
            {languageContent.swipe_left_to_reply}
          </MainText>
        </FadeAnimatedView>
      );
    }

    return null;
  };

  return (
    <>
      <HeaderFlatList
        data={spots}
        removeMargin
        enabledAnimation
        isLoading={isLoading}
        renderItem={renderItem}
        estimatedItemSize={200}
        headerProps={headerProps}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        bulkCount={querylimits.EIGHT}
        renderHeader={renderHeader}
        floatingButtonProps={floatingButtonProps}
        renderEmptyComponent={renderEmptyComponent}
      />

      <ConfirmView
        visible={visibleBadge}
        setVisible={setVisibleBadge}
        title={languageContent.its_me}
      />
    </>
  );
};

export default BusinessSpotsScreen;

const styles = StyleSheet.create({
  headerContianer: {
    padding: "3%",
    marginBottom: 16,
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

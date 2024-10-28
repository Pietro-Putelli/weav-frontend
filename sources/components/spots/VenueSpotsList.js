import React, { forwardRef, memo, useCallback, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { pushNavigation } from "../../navigation/actions";
import mergeRefs from "../../utility/mergeRefs";
import { FadeAnimatedView } from "../animations";
import { HorizontalCarousel } from "../lists";
import { Hairline, SeparatorTitle } from "../separators";
import VenueSpotCell from "./VenueSpotCell";
import { CELL_SIDE } from "./constants";
import { MainText } from "../texts";
import { SquareImage } from "../images";
import { icons } from "../../styles";
import { useLanguages } from "../../hooks";

const VenueSpotsList = forwardRef(
  (
    {
      venues,
      componentId,
      selectedVenueId,
      onSnapToVenue,
      isNotFound,
      onPress,
      ...props
    },
    ref
  ) => {
    const listRef = useRef();
    const { languageContent } = useLanguages();

    const _onPress = ({ venue, index }) => {
      const isSelected = venue.id === selectedVenueId;

      if (isSelected) {
        pushNavigation({
          screen: SCREENS.VenueDetail,
          componentId,
          passProps: {
            initialBusiness: venue,
            isFromSpotScreen: true,
          },
        });
      } else {
        listRef.current?.scrollToIndex({
          index,
          animated: true,
        });

        onPress?.({ venue, index });
      }
    };

    const renderItem = useCallback(
      ({ item, index }) => {
        const isSelected = item.id === selectedVenueId;

        return (
          <VenueSpotCell
            venue={item}
            index={index}
            onPress={_onPress}
            isSelected={isSelected}
          />
        );
      },
      [onPress, selectedVenueId]
    );

    return (
      <FadeAnimatedView>
        <HorizontalCarousel
          data={venues}
          ref={mergeRefs([listRef, ref])}
          bulkCount={8}
          itemWidth={CELL_SIDE}
          renderItem={renderItem}
          scrollEventThrottle={16}
          onEndReachedThreshold={1}
          extraData={selectedVenueId}
          onSnapToItem={onSnapToVenue}
          showsHorizontalScrollIndicator={false}
          {...props}
        />

        <View style={styles.container}>
          <Hairline width={0.96} style={styles.hairline} />

          <View
            style={{
              marginLeft: 4,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <SquareImage source={icons.Info} side={16} />

            <MainText style={{ marginLeft: 8 }} font="subtitle-2" bold>
              {languageContent.swipe_left_to_reply}
            </MainText>
          </View>

          <SeparatorTitle marginTop>spots</SeparatorTitle>
        </View>
      </FadeAnimatedView>
    );
  }
);

export default memo(VenueSpotsList);

const styles = StyleSheet.create({
  container: {
    marginTop: "4%",
    marginHorizontal: 8,
  },
  hairline: { marginTop: 0, marginBottom: "3%" },
});

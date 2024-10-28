import { isEmpty, isUndefined } from "lodash";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import {
  FadeAnimatedView,
  FirstLoadingAnimatedView,
} from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { SingleTitleCell } from "../../components/cells";
import { StretchableHeaderView } from "../../components/containers";
import { PostCell } from "../../components/posts";
import { Hairline, SeparatorTitle } from "../../components/separators";
import {
  ButtonsView,
  TimetableCell,
  Title,
  VenueEventsPreviewList,
  VenueHighlights,
  VenueInfoView,
} from "../../components/venue";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useBusinessPosts, useBusinesses, useLanguages } from "../../hooks";
import {
  pushNavigation,
  showModalNavigation,
  showSheetNavigation,
} from "../../navigation/actions";
import { getMyBusinessEventsState } from "../../store/slices/eventsReducer";
import { icons, typographies } from "../../styles";
import { isNullOrUndefined } from "../../utility/boolean";
import { makeCall } from "../../utility/linking";

const BusinessDetailScreen = ({
  initialBusiness,
  isFromSpotScreen,
  preview,
  componentId,
}) => {
  const { languageContent } = useLanguages();

  const isPreview = !isUndefined(preview);

  const { businessId, businessHasName } = useMemo(() => {
    const businessId = initialBusiness?.id;
    const businessHasName =
      !isUndefined(initialBusiness?.name) || !isUndefined(preview?.name);

    return {
      businessId,
      businessHasName,
    };
  }, []);

  let { business, hasPosts, currentEvent, isFullyLoaded, isLoading } =
    useBusinesses({
      businessId,
      isPreview,
      initialBusiness,
    });

  const { posts, isLoading: isLoadingPosts } = useBusinessPosts({
    businessId,
    hasPosts,
    isPreview,
  });

  /* use only for preview */
  let myBusinessEvents = [];

  if (isPreview) {
    myBusinessEvents = useSelector(getMyBusinessEventsState);
  }

  const { highlights, events } = useMemo(() => {
    const highlights = business?.highlights ?? [];
    const events = business?.events ?? myBusinessEvents;

    return { highlights, events };
  }, [myBusinessEvents]);

  const hasEvents = !isUndefined(events) && !isEmpty(events);

  if (preview) {
    business = preview;
  }

  const scrollRef = useRef();

  const {
    isChatAllowed,
    isPhoneNumberAllowed,
    isReserveViewVisible,

    hasTimetable,
    hasHighlights,
    deliveryOptions,
    hasOnlyTimetable,
  } = useMemo(() => {
    const isChatAllowed = business?.allow_chat;
    const isPhoneNumberAllowed = !isNullOrUndefined(business?.phone);

    const hasHighlights = !isEmpty(highlights);

    const hasBothChatAndPhone = isChatAllowed && isPhoneNumberAllowed;

    const deliveryOptions = business?.delivery_options ?? [];
    const hadDeliveryOptions = !isEmpty(deliveryOptions);

    const isReserveViewVisible = hadDeliveryOptions || hasBothChatAndPhone;

    const timetable = business?.timetable;

    const hasTimetable = !isNullOrUndefined(timetable);

    const hasOnlyTimetable =
      isNullOrUndefined(business?.description) && isEmpty(business?.amenities);

    return {
      isChatAllowed,
      isPhoneNumberAllowed,
      hasHighlights,
      isReserveViewVisible,
      hasBothChatAndPhone,
      deliveryOptions,
      hadDeliveryOptions,
      hasOnlyTimetable,
      hasTimetable,
    };
  }, [business, highlights, isPreview]);

  const isLoadingBusiness = useMemo(() => {
    return (isLoading || !isFullyLoaded) && !isPreview;
  }, [isLoading, isFullyLoaded, isPreview]);

  const onAddressPress = () => {
    showModalNavigation({
      screen: SCREENS.VenueMap,
      passProps: {
        venue: business,
      },
    });
  };

  const onVenueDescription = () => {
    showSheetNavigation({
      screen: SCREENS.VenueDescription,
      passProps: { venue: business },
    });
  };

  const onPostPress = useCallback(
    (index) => {
      showModalNavigation({
        screen: SCREENS.BusinessPosts,
        fullscreen: true,
        passProps: {
          businessId,
          initialIndex: index,
        },
      });
    },
    [business, posts]
  );

  const onMorePress = useCallback(() => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: {
        businessId: business.id,
        type: actiontypes.MENU_MODAL.VENUE_MORE,
      },
    });
  }, [business]);

  const onChatPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.ChatMessage,
      passProps: { business },
    });
  };

  const onPhonePress = () => {
    makeCall(business.phone);
  };

  /* When press "reserve" button or "highlights" */
  const onContactPress = useCallback(
    (showOnlyContacts) => {
      // if (hasBothChatAndPhone || hadDeliveryOptions) {
      showSheetNavigation({
        screen: SCREENS.ReserveOptions,
        passProps: {
          onChatPress,
          onPhonePress,
          isChatAllowed,
          deliveryOptions,
          isPhoneNumberAllowed,
          showOnlyContacts,
        },
      });
      // } else if (isChatAllowed) {
      //   onChatPress();
      // } else if (isPhoneNumberAllowed) {
      //   onPhonePress();
      // }
    },
    [business]
  );

  const onSpotsPress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.BusinessMoments,
      passProps: { business },
    });
  }, [business]);

  /* Components */

  const renderItem = useCallback(
    ({ item: post, index }) => {
      return (
        <PostCell
          post={post}
          index={index}
          marginVertical
          onPress={() => onPostPress(index)}
        />
      );
    },
    [posts, business]
  );

  const { data, address } = useMemo(() => {
    return {
      data: posts,
      address: business?.location?.address,
    };
  }, [posts, business]);

  return (
    <StretchableHeaderView
      data={data}
      ref={scrollRef}
      isBottomVisible
      business={business}
      event={currentEvent}
      isPreview={isPreview}
      renderItem={renderItem}
      onMorePress={onMorePress}
      onSpotsPress={onSpotsPress}
      isLoading={isLoadingBusiness}
      isLoadingPosts={isLoadingPosts}
      onContactPress={onContactPress}
      showReserve={isReserveViewVisible}
      showSpots={!isFromSpotScreen}
    >
      <FadeAnimatedView style={styles.fadeContent}>
        {businessHasName && (
          <>
            <View style={styles.content}>
              <Title
                business={business}
                componentId={componentId}
                isLoading={isLoadingBusiness}
              />

              <FirstLoadingAnimatedView isLoading={isLoadingBusiness}>
                <Hairline style={styles.topSeparator} />

                <View style={{ marginTop: "0%" }}>
                  <ButtonsView
                    business={business}
                    isPreview={isPreview}
                    componentId={componentId}
                  />
                </View>

                {hasEvents && <Hairline style={styles.bottomSeparator} />}
              </FirstLoadingAnimatedView>
            </View>

            {hasEvents && (
              <View style={styles.eventsContainer}>
                <VenueEventsPreviewList
                  events={events}
                  business={business}
                  isPreview={isPreview}
                  componentId={componentId}
                />
              </View>
            )}

            <FirstLoadingAnimatedView isLoading={isLoadingBusiness}>
              {address && (
                <SingleTitleCell
                  coloredIcon
                  title={address}
                  style={styles.iconCell}
                  onPress={onAddressPress}
                  icon={icons.ColoredMarker}
                  textStyle={{ fontSize: typographies.fontSizes.subtitle1 }}
                />
              )}

              {hasPosts ? (
                <View style={styles.content}>
                  {hasOnlyTimetable && hasTimetable && (
                    <TimetableCell timetable={business.timetable} />
                  )}

                  {!hasOnlyTimetable && (
                    <SolidButton
                      style={{ marginTop: "1%", borderRadius: 16 }}
                      onPress={onVenueDescription}
                      title={languageContent.more_info}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.content}>
                  <VenueInfoView
                    venue={business}
                    hasPosts={hasPosts}
                    isPreview={isPreview}
                  />
                </View>
              )}

              <View style={styles.content}>
                {hasHighlights && (
                  <VenueHighlights
                    highlights={highlights}
                    onPress={onContactPress}
                  />
                )}

                {hasPosts && (
                  <SeparatorTitle style={styles.postsTitle}>
                    posts
                  </SeparatorTitle>
                )}
              </View>
            </FirstLoadingAnimatedView>
          </>
        )}
      </FadeAnimatedView>
    </StretchableHeaderView>
  );
};

export default BusinessDetailScreen;

const styles = StyleSheet.create({
  iconCell: {
    padding: 16,
    marginHorizontal: 8,
  },
  separator_title: {
    marginTop: "6%",
    marginBottom: "1%",
    marginLeft: "4%",
  },
  content: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  fadeContent: { minHeight: 100, marginTop: -10 },
  topSeparator: {
    marginVertical: 16,
    width: "97%",
  },
  bottomSeparator: {
    width: "99%",
    marginBottom: 0,
  },
  eventsContainer: {
    marginTop: "3%",
    marginBottom: "2%",
    marginHorizontal: 8,
  },
  postsTitle: { marginLeft: 0, marginBottom: "3%", marginTop: "2%" },
});

import { isUndefined } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { EventDetailActionsView } from "../../components/actions";
import { FadeAnimatedView } from "../../components/animations";
import { ToastAlertView } from "../../components/badgeviews";
import {
  BlurIconButton,
  JoinEventButton,
  SolidButton,
} from "../../components/buttons";
import { MainScrollView } from "../../components/containers";
import {
  EventDateLiveCell,
  EventDetailCell,
  EventParticipantsCell,
  EventParticipantsList,
} from "../../components/events";
import { EventCoverPreview, SquareImage } from "../../components/images";
import { Separator, SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { formatTime } from "../../dates/formatters";
import {
  getEventRelativeDate,
  getIsEventLive,
  isTodayOrTomorrow,
} from "../../dates/functions";
import { useEvents, useLanguages, useTheme } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { removeEventChat } from "../../store/slices/chatsReducer";
import { icons, typographies } from "../../styles";
import { isNullOrEmpty } from "../../utility/strings";

const { width } = Dimensions.get("window");

/* Use popOnLeave to go back when the user navigate to this screen from chat, because when you destory 
the chat the data are updated but the screen in loaded in memory => error */

const EventDetailScreen = ({ eventId, popOnLeave, componentId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const onLeaveEvent = () => {
    navigation.popToRoot().then(() => {
      dispatch(removeEventChat(eventId));
    });
  };

  const { event, isLoading, goToEvent } = useEvents({
    eventId,
    onLeaveEvent: popOnLeave ? onLeaveEvent : null,
  });

  const [discussionVisible, setDiscussionVisible] = useState(false);

  /* Props */

  const businessProfile = event?.business;

  const {
    description,
    guests,
    price,
    ticket,
    hasGuests,
    hasPriceDetail,
    hasTicketLink,
    hasParticipants,
    repostsCount,
    imGoing,
  } = useMemo(() => {
    if (event?.has_detail) {
      return {
        ...event,

        hasGuests: !isNullOrEmpty(event.guests),
        hasPriceDetail: !isNullOrEmpty(event.price),
        hasTicketLink: !isNullOrEmpty(event.ticket),
        hasParticipants: event.participants?.count > 0,
        repostsCount: event.reposts_count,
        imGoing: event.is_going,
      };
    }

    return {};
  }, [event]);

  const { verboseDate } = useMemo(() => {
    const date = event?.date;

    let verboseDate = isTodayOrTomorrow(date);

    let isPeriodicEvent = false;

    const periodicDay = event?.periodic_day;

    if (!isUndefined(periodicDay)) {
      verboseDate = getEventRelativeDate(event);
      isPeriodicEvent = true;
    }

    const { time } = formatTime({ time: event?.time });

    verboseDate = `${verboseDate} at ${time}`;

    return {
      verboseDate,
      isPeriodicEvent,
    };
  }, [event]);

  const isLive = useMemo(() => {
    if (event) {
      return getIsEventLive(event);
    }
    return false;
  }, [event]);

  /* Styles */

  const navigationProps = useMemo(() => {
    return {
      title: event?.title,
      rightIcon: icons.More,
    };
  }, [onMorePress, event]);

  /* Callbacks */

  const onGoPress = useCallback(
    (isGoing) => {
      goToEvent((isDone) => {
        if (isDone && isGoing) {
          setDiscussionVisible(true);
        }
      });
    },
    [event]
  );

  const onWherePress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.VenueDetail,
      passProps: { initialBusiness: businessProfile },
    });
  }, [businessProfile]);

  const onPricePress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.Web,
      passProps: {
        url: ticket,
      },
    });
  }, [ticket]);

  const onParticipantsPress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.EventUsersList,
      passProps: { eventId: event.id },
    });
  }, [event]);

  const onMorePress = useCallback(() => {
    showSheetNavigation({
      screen: SCREENS.MenuModal,
      passProps: { type: actiontypes.MENU_MODAL.EVENT_DETAIL_MORE },
    });
  }, []);

  const onJoinPress = () => {
    goToEvent(() => {});
  };

  /* Component's Props */

  const buyTicketsCellProps = useMemo(() => {
    if (hasPriceDetail && !hasTicketLink) {
      return {
        subtitle: languageContent.price_info,
      };
    }

    return {
      subtitle: languageContent.buy,
      onPress: onPricePress,
    };
  }, [hasPriceDetail, hasTicketLink]);

  const renderPartecipateButton = useCallback(() => {
    return <JoinEventButton isActive={imGoing} onPress={onJoinPress} />;
  }, [imGoing]);

  return (
    <>
      <MainScrollView
        isLoading={isLoading}
        onRightPress={onMorePress}
        contentStyle={styles.scrollContent}
        renderBottomContent={renderPartecipateButton}
        {...navigationProps}
      >
        <FadeAnimatedView>
          <View style={{ alignSelf: "center" }}>
            <EventCoverPreview event={event}>
              <View style={styles.buttons}>
                <View style={{ flex: 1 }}>
                  {/* <BlurIconButton
                    isInverted
                    event={event}
                    count={repostsCount}
                    icon={icons.Conversation}
                    onPress={onConversationPress}
                  /> */}
                </View>

                <BlurIconButton event={event} count={repostsCount} />
              </View>
            </EventCoverPreview>
          </View>

          <View style={styles.dateContainer}>
            {isLive ? (
              <EventDateLiveCell event={event} />
            ) : (
              <View style={[theme.styles.shadow_round, styles.dateTimeContent]}>
                <SquareImage
                  percentage={0.8}
                  source={icons.ColoredCalendar}
                  coloredIcon
                />
                <MainText
                  style={{ marginHorizontal: "4%" }}
                  bold
                  font="subtitle"
                >
                  {verboseDate}
                </MainText>
              </View>
            )}

            <EventParticipantsCell
              event={event}
              onPress={onParticipantsPress}
            />

            <SeparatorTitle marginTop>
              {languageContent.separator_titles.about}
            </SeparatorTitle>

            <EventDetailCell
              onPress={onWherePress}
              icon={icons.ColoredMarker}
              title={businessProfile?.name}
              style={{ marginBottom: "3%" }}
              subtitle={businessProfile?.city}
            />

            {hasGuests && (
              <EventDetailCell
                subtitle={languageContent.guests}
                icon={icons.Guest}
                title={guests}
                style={{ marginBottom: "3%" }}
              />
            )}

            {hasPriceDetail && (
              <EventDetailCell
                title={price}
                icon={icons.Price}
                style={{ marginBottom: "3%" }}
                {...buyTicketsCellProps}
              />
            )}

            {!isNullOrEmpty(description) && (
              <View
                style={[theme.styles.shadow_round, styles.descriptionContainer]}
              >
                <MainText font="subtitle-2">{event.description}</MainText>
              </View>
            )}

            <EventDetailActionsView
              event={event}
              onGoPress={onGoPress}
              componentId={componentId}
            />

            {hasParticipants && (
              <>
                <Separator style={{ marginBottom: 12 }} />
                <EventParticipantsList
                  componentId={componentId}
                  participants={event?.participants}
                  onMorePress={onParticipantsPress}
                />
              </>
            )}
          </View>
        </FadeAnimatedView>
      </MainScrollView>

      <ToastAlertView
        icon={icons.ColoredChat}
        visible={discussionVisible}
        setVisible={setDiscussionVisible}
      >
        {languageContent.added_to_event_discussion}
      </ToastAlertView>
    </>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  dateContainer: {
    marginTop: "6%",
  },
  dateTimeContent: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  descriptionContainer: {
    padding: "4%",
    marginBottom: "3%",
  },
  participantsCount: {
    fontSize: typographies.fontSizes.title6,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingTop: "2%",
  },
  buttons: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: "4%",
    justifyContent: "space-between",
    bottom: 16,
  },
});

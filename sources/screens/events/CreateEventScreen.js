import { isUndefined } from "lodash";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { RFPercentage } from "react-native-responsive-fontsize";
import { RecentPicksView } from "../../components/addmoment";
import { FadeAnimatedView } from "../../components/animations";
import { ToastAlertView } from "../../components/badgeviews";
import { SolidButton } from "../../components/buttons";
import { MainScrollView } from "../../components/containers";
import { EdgeGesture } from "../../components/gestures";
import { EventCoverPreview, SquareImage } from "../../components/images";
import { MainTextInput, TextView } from "../../components/inputs";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { getMMMDo } from "../../dates/dateFormats";
import {
  formatDate,
  formatPeriodicDate,
  formatTime,
} from "../../dates/formatters";
import {
  useCreateEvent,
  useCurrentBusiness,
  useLanguages,
  useTheme,
} from "../../hooks";
import { showSheetNavigation, showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { isNullOrUndefined } from "../../utility/boolean";
import { openPicker } from "../../utility/imagepicker";

const DESCRIPTION_HEIGHT = RFPercentage(12);
const ICON_SIDE = ICON_SIZES.two;

const CreateEventScreen = ({
  eventId,
  onCreated,
  componentId,
  initialEvent,
}) => {
  const {
    event,
    hasEventChanged,

    isEditing,
    isLoading,
    isDoneEnabled,
    isCoverInvalid,

    updateEventState,
    createOrUpdateEvent,
  } = useCreateEvent({ eventId, initialEvent });

  const { business } = useCurrentBusiness();

  const { languageContent } = useLanguages();

  const [popupVisible, setPopupVisible] = useState(false);

  /* Props */

  const hasCover = !isNullOrUndefined(event?.cover);

  const date = event?.date;

  const isPeriodicEvent =
    !isNullOrUndefined(event?.periodic_day) || event?.isPeriodic;
  const location = event?.location;

  const formattedDate = useMemo(() => {
    if (isPeriodicEvent) {
      return formatPeriodicDate(date ?? event.periodic_day);
    }

    if (date) {
      return formatDate({ date, format: getMMMDo() });
    }

    return languageContent.add_date;
  }, [event]);

  const { startTime, endTime } = useMemo(() => {
    const startTime = event?.time;
    const endTime = event?.end_time;

    let response = {
      startTime: languageContent.add_time,
      endTime: languageContent.add_time,
    };

    if (startTime) {
      response.startTime = formatTime({ time: startTime, isPlain: true });
    }

    if (endTime) {
      response.endTime = formatTime({ time: event?.end_time, isPlain: true });
    }

    return response;
  }, [event]);

  const formattedLocation = useMemo(() => {
    const businessAddress = business?.location?.address;

    if (!location && businessAddress) {
      return businessAddress;
    }

    if (location) {
      return location.address;
    }

    return languageContent.tap_to_add_location;
  }, [location]);

  const infoCases = useMemo(() => {
    return {
      first: [
        {
          icon: icons.Guest,
          placeholder: languageContent.add_guests,
          type: "guests",
        },
        {
          icon: icons.Price,
          placeholder: languageContent.add_price_info,
          type: "price",
        },
        {
          icon: icons.ColoredTickets,
          placeholder: languageContent.add_ticket_url,
          type: "ticket",
          extraProps: { keyboardType: "url" },
        },
      ],
      second: [
        {
          icon: icons.ColoredInstagram,
          placeholder: languageContent.add_instagram,
          type: "instagram",
        },
        {
          icon: icons.ColoredLink,
          placeholder: languageContent.add_website,
          type: "website",
          extraProps: { keyboardType: "url" },
        },
      ],
    };
  }, [business]);

  /* Hooks */

  const theme = useTheme();
  const navigation = useNavigation();

  /* Props */

  const navigationTitle = useMemo(() => {
    return isEditing
      ? languageContent.edit_event
      : languageContent.create_event;
  }, []);

  const doneButtonTitle = useMemo(() => {
    if (isEditing) {
      return languageContent.update_event;
    }
    return languageContent.create_event;
  }, []);

  /* Callbacks */

  const onBack = useCallback(() => {
    if (hasEventChanged) {
      setPopupVisible(true);
    } else {
      navigation.dismissModal();
    }
  }, [hasEventChanged]);

  const onChangeText = useCallback((value, key) => {
    updateEventState({ [key]: value });
  }, []);

  /* Date and time */

  const onDateTimePress = (type) => {
    const time = type == "time" ? startTime : endTime;

    const isTimePicker = type == "time" || type == "end_time";

    const modalType = actiontypes.PICKERS;

    showSheetNavigation({
      screen: SCREENS.DateTimePicker,
      passProps: {
        type: isTimePicker ? modalType.TIME : modalType.PERIODIC_DATE,
        value: isTimePicker
          ? time
          : { value: date, isPeriodic: isPeriodicEvent },
        onValueChanged: (params) => {
          const isPeriodic = params?.isPeriodic;

          if (!isUndefined(isPeriodic)) {
            updateEventState({ date: params.value, isPeriodic });
          } else {
            // params is of type string
            updateEventState({ [type]: params });
          }
        },
      },
    });
  };

  /* Address */

  const onAddressPress = useCallback(() => {
    showStackModal({
      screen: SCREENS.EditAddress,
      passProps: {
        isModal: true,
        onLocationDidChange: (location) => {
          updateEventState({ location });
        },
      },
    });
  }, []);

  /* Create Event */

  const onCreatePress = () => {
    Keyboard.dismiss();

    createOrUpdateEvent(() => {
      navigation.dismissModal();

      onCreated?.();
    });
  };

  const onAssetSelected = (asset) => {
    updateEventState({ cover: asset });
  };

  /* Methods */

  const onSourcePress = useCallback(() => {
    openPicker({ cropping: false }, onAssetSelected);
  }, [onAssetSelected]);

  /* Components */

  const renderBottomContent = () => {
    return (
      <SolidButton
        type="done"
        icon={icons.Done}
        loading={isLoading}
        title={doneButtonTitle}
        onPress={onCreatePress}
        disabled={!isDoneEnabled}
      />
    );
  };

  /* Styles */

  const solidStyle = useMemo(() => {
    return [theme.styles.shadow_round, styles.solidContainer];
  }, []);

  return (
    <EdgeGesture
      onBack={onBack}
      visible={popupVisible}
      setVisible={setPopupVisible}
    >
      <MainScrollView
        modal
        keyboardAware
        title={navigationTitle}
        contentStyle={styles.scrollContent}
        isBottomContentVisible={isDoneEnabled}
        renderBottomContent={renderBottomContent}
      >
        {hasCover ? (
          <>
            <EventCoverPreview onPress={onSourcePress} event={event} />

            <FadeAnimatedView style={styles.content}>
              <SeparatorTitle>{languageContent.date}</SeparatorTitle>

              <BounceView
                onPress={() => onDateTimePress("date")}
                style={solidStyle}
              >
                <SquareImage
                  coloredIcon
                  source={icons.ColoredCalendar}
                  side={ICON_SIZES.two}
                />
                <MainText bold font="title-8" style={styles.text}>
                  {formattedDate}
                </MainText>
              </BounceView>

              <View style={styles.timeBoundsContainer}>
                <TimeCell
                  type="time"
                  time={startTime}
                  onPress={onDateTimePress}
                />

                <TimeCell
                  type="end_time"
                  time={endTime}
                  onPress={onDateTimePress}
                />
              </View>

              <SeparatorTitle marginTop>{languageContent.title}</SeparatorTitle>

              <MainTextInput
                solid
                maxLength={32}
                value={event?.title}
                onChangeText={(value) => {
                  onChangeText(value, "title");
                }}
                placeholder={languageContent.event_title_placeholder}
              />

              <SeparatorTitle marginTop>
                {languageContent.location}
              </SeparatorTitle>

              <BounceView onPress={onAddressPress} style={solidStyle}>
                <SquareImage
                  coloredIcon
                  side={ICON_SIDE}
                  source={icons.ColoredMarker}
                />
                <MainText
                  font="subtitle-1"
                  style={{ flex: 1, marginHorizontal: "3%" }}
                >
                  {formattedLocation}
                </MainText>

                <SquareImage
                  source={icons.Chevrons.Right}
                  side={ICON_SIZES.chevron_right}
                  color={theme.colors.placeholderText}
                />
              </BounceView>

              <SeparatorTitle marginTop>
                {languageContent.description}
              </SeparatorTitle>

              <TextView
                solid
                value={event?.description}
                onChangeText={(value) => {
                  onChangeText(value, "description");
                }}
                height={DESCRIPTION_HEIGHT}
                placeholder={languageContent.add_event_description}
              />

              <SeparatorTitle marginTop noBottom>
                {languageContent.guests_and_price}
              </SeparatorTitle>

              {infoCases.first.map((info, index) => {
                return (
                  <InfoCell
                    value={event?.[info.type]}
                    onChangeText={onChangeText}
                    key={index}
                    {...info}
                  />
                );
              })}

              <SeparatorTitle marginTop noBottom>
                {languageContent.instagram_and_website}
              </SeparatorTitle>

              {infoCases.second.map((info, index) => {
                return (
                  <InfoCell
                    onChangeText={onChangeText}
                    key={index}
                    value={event?.[info.type]}
                    {...info}
                  />
                );
              })}
            </FadeAnimatedView>
          </>
        ) : (
          <RecentPicksView
            componentId={componentId}
            style={{ marginTop: "25%" }}
            onAssetSelected={onAssetSelected}
          />
        )}
      </MainScrollView>

      <ToastAlertView visible={isCoverInvalid} isTop>
        {languageContent.nice_try}
      </ToastAlertView>
    </EdgeGesture>
  );
};

export default CreateEventScreen;

const InfoCell = memo(
  ({ value, icon, placeholder, type, onChangeText, extraProps }) => {
    const theme = useTheme();

    const cellStyle = useMemo(() => {
      return [theme.styles.shadow_round, styles.infoCell];
    }, []);

    return (
      <View style={cellStyle}>
        <SquareImage coloredIcon source={icon} side={ICON_SIDE} />

        <MainTextInput
          font="subtitle"
          value={value}
          style={styles.textInput}
          placeholder={placeholder}
          onChangeText={(value) => onChangeText(value, type)}
          {...extraProps}
        />
      </View>
    );
  }
);

const TimeCell = memo(({ time, type, onPress }) => {
  const theme = useTheme();
  const { dateTimeLanguageContent } = useLanguages();

  const containerStyle = useMemo(() => {
    return [theme.styles.cell, styles.timeCell];
  }, []);

  return (
    <View style={{ flex: 1, marginRight: type == "time" ? "3%" : 0 }}>
      <MainText
        bold
        font="subtitle-5"
        style={{ marginBottom: 8, marginLeft: 4 }}
        uppercase
      >
        {type == "time"
          ? dateTimeLanguageContent.starts_at
          : dateTimeLanguageContent.ends_at}
      </MainText>

      <BounceView onPress={() => onPress(type)} style={containerStyle}>
        <SquareImage
          style={{ marginRight: 12 }}
          coloredIcon
          side={ICON_SIDE}
          source={icons.ColoredClock}
        />
        <MainText bold font="title-8" style={{ marginRight: "3%" }}>
          {time}
        </MainText>
      </BounceView>
    </View>
  );
});

const styles = StyleSheet.create({
  solidContainer: {
    flex: 1,
    padding: "4%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeCell: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  infoCell: {
    marginTop: "3%",
    padding: "4%",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 16,
  },
  textInput: {
    flex: 1,
    marginLeft: 16,
  },
  timeBoundsContainer: {
    marginTop: "3%",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    width: "100%",
    marginTop: "6%",
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingTop: "2%",
    paddingHorizontal: 0,
    alignItems: "center",
  },
});

import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { getEventRelativeDate } from "../../dates/functions";
import { useCurrentBusiness, useLanguages, useTheme } from "../../hooks";
import {
  pushNavigation,
  showModalNavigation,
  showStackModal,
} from "../../navigation/actions";
import { icons } from "../../styles";
import { formatShareEventForInstagram } from "../../utility/shareApis";
import { FadeAnimatedView } from "../animations";
import { CacheableImageView, SquareImage } from "../images";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import { BounceView, LiveDot } from "../views";

const { width } = Dimensions.get("window");

const CELL_WIDTH = (width - 16 - 8 * 2) / 3;

const VenueEventsPreviewList = ({
  isPreview,
  business,
  events,
  componentId,
}) => {
  const { isBusiness } = useCurrentBusiness();

  const { languageContent } = useLanguages();

  const allEvents = useMemo(() => {
    if (isBusiness && !isPreview) {
      return [...(events ?? []), { id: -1 }];
    }

    return events;
  }, [events]);

  const onEventPress = useCallback((event) => {
    if (event.id === -1) {
      showStackModal({ screen: SCREENS.CreateEvent });
    } else {
      pushNavigation({
        componentId,
        screen: isBusiness ? SCREENS.BusinessEventPreview : SCREENS.EventDetail,
        passProps: { eventId: event.id },
      });
    }
  }, []);

  const onEventLongPress = useCallback((event) => {
    if (isBusiness) {
      showModalNavigation({
        screen: SCREENS.BusinessShareEvent,
        passProps: { eventId: event.id, sliceIndex: 0 },
      });
    } else {
      showModalNavigation({
        screen: SCREENS.Share,
        passProps: {
          event: formatShareEventForInstagram({ event, business }),
        },
      });
    }
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      const isLast = index === events?.length;

      return (
        <EventPreviewCell
          event={item}
          isLast={isLast}
          disabled={isPreview}
          onPress={onEventPress}
        />
      );
    },
    [events]
  );

  return (
    <View style={styles.container}>
      <SeparatorTitle>{languageContent.separator_titles.events}</SeparatorTitle>

      <View style={{ marginTop: 4 }}>
        <FlatList
          horizontal
          data={allEvents}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

export default memo(VenueEventsPreviewList);

const EventPreviewCell = ({
  event,
  isLast,
  disabled,
  onPress,
  onLongPress,
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const isPlaceholder = event.id === -1;

  const _onLongPress = () => {
    if (!isPlaceholder) {
      onLongPress?.(event);
    }
  };

  const containerStyle = useMemo(() => {
    return [styles.cell, { marginRight: isLast ? 0 : 8 }];
  }, [isLast]);

  const imageContainerStyle = useMemo(() => {
    return [theme.styles.shadow_round, styles.imageContainer];
  }, []);

  const { isNow, title } = useMemo(() => {
    const { date, periodic_day, time } = event;

    const response = getEventRelativeDate({ date, periodic_day, time });

    if (response == "now") {
      return { isNow: true };
    }

    return { title: response };
  }, [event]);

  const textProps = useMemo(() => {
    return {
      align: "center",
      numberOfLines: 2,
      font: "subtitle-3",
      bold: true,
      uppercase: true,
      style: styles.title,
    };
  }, []);

  return (
    <FadeAnimatedView mode="fade-right">
      <BounceView
        activeScale={0.95}
        style={containerStyle}
        onLongPress={_onLongPress}
        onPress={() => onPress(event)}
        disabledWithoutOpacity={disabled}
      >
        <View style={imageContainerStyle}>
          {isPlaceholder ? (
            <View style={styles.addCell}>
              <SquareImage source={icons.Add} />
            </View>
          ) : (
            <CacheableImageView
              source={event.cover}
              style={StyleSheet.absoluteFill}
            />
          )}
        </View>

        <View style={styles.titleContainer}>
          {isPlaceholder ? (
            <MainText {...textProps}>{languageContent.new_event}</MainText>
          ) : (
            <>
              {isNow ? (
                <View style={{ marginLeft: -8 }}>
                  <LiveDot />
                </View>
              ) : (
                <MainText style={styles.title} {...textProps}>
                  {title}
                </MainText>
              )}
            </>
          )}
        </View>
      </BounceView>
    </FadeAnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {},
  cell: {
    width: CELL_WIDTH,
    alignItems: "center",
  },
  addCell: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    width: CELL_WIDTH * 0.9,
    height: CELL_WIDTH * 0.9,
    overflow: "hidden",
    borderRadius: (CELL_WIDTH * 0.9) / 2.2,
  },
  titleContainer: {
    marginTop: 12,
    flexDirection: "row",
  },
  emptyPlaceholder: {
    width: width - 16,
    alignItems: "center",
  },
  title: {
    marginHorizontal: 8,
  },
});

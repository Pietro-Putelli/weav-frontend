import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Analytics, analyticTypes } from "../../analytics";
import { SCREENS } from "../../constants/screens";
import { useEvents, useTheme } from "../../hooks";
import {
  pushNavigation,
  showModalNavigation,
  showSheetNavigation,
  showStackModal,
} from "../../navigation/actions";
import { icons } from "../../styles";
import { getEventCellSize } from "../../styles/sizes";
import { OR } from "../../utility/boolean";
import { formatShareEventForInstagram } from "../../utility/shareApis";
import { FadeAnimatedView, ScaleAnimatedView } from "../animations";
import { BlurIconButton } from "../buttons";
import { CacheableImageView, SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, LinearGradientView } from "../views";
import EventDatePreview from "./EventDatePreview";
import MomentParticipantsView from "./MomentParticipantsView";
import SwipeableContainer from "./SwipeableContainer";

const { width } = Dimensions.get("window");

const EventCell = ({
  moment,
  isPreview,
  isChatPreview,
  onEventJoined,
  componentId,
}) => {
  const theme = useTheme();

  const { id: eventId, cover, participants, is_going: imGoing } = moment;

  const { goToEvent } = useEvents({ eventId });

  const { repostsCount, participantsCount, bottomGradientVisible } =
    useMemo(() => {
      let verboseUsers = "";

      const participantsCount = participants?.count ?? 0;
      const repostsCount = moment.reposts_count ?? 0;

      const bottomGradientVisible = participantsCount != 0 || repostsCount != 0;

      return {
        verboseUsers,
        repostsCount,
        participantsCount,
        bottomGradientVisible,
      };
    }, [moment]);

  /* States */

  const swipeDisabled = OR(isChatPreview, isPreview);

  /* Callbacks */

  const onPress = useCallback(() => {
    pushNavigation({
      componentId,
      screen: SCREENS.EventDetail,
      passProps: { eventId: moment.id },
    });
  }, [moment]);

  const onLongPress = useCallback(() => {
    showModalNavigation({
      screen: SCREENS.Share,
      passProps: {
        event: formatShareEventForInstagram({ event: moment }),
      },
    });
  }, [moment]);

  const onRepostedTriggered = useCallback(() => {
    Analytics.sendEvent(analyticTypes.BEGIN_EVENT_REPOST);

    showStackModal({
      screen: SCREENS.CreateMoment,
      passProps: {
        initialMoment: { event: moment },
      },
    });
  }, [moment]);

  const onParticipantsPress = () => {
    showSheetNavigation({
      isStack: true,
      screen: SCREENS.EventParticipants,
      passProps: {
        eventId,
        imGoing,
        participantsCount,
        onEventJoined,
      },
    });
  };

  const onSwipeRight = () => {
    goToEvent(() => {
      onEventJoined?.(!imGoing);
    });
  };

  /* Styles */

  const containerSize = useMemo(() => {
    return getEventCellSize({
      ratio: moment.ratio,
      scale: isChatPreview ? 0.8 : 1,
    });
  }, [moment]);

  const containerStyle = useMemo(() => {
    const { width, height } = containerSize;

    return {
      ...styles.container,
      ...theme.styles.shadow_round,
      width,
      height: height + 10,
    };
  }, [containerSize]);

  return (
    <FadeAnimatedView>
      <BounceView onLongPress={onLongPress} onPress={onPress}>
        <SwipeableContainer
          style={containerStyle}
          leftIcon={imGoing ? icons.Going : icons.Play}
          rightIcon={icons.Repost}
          disabled={swipeDisabled}
          onSwipeRight={onSwipeRight}
          onSwipeLeft={onRepostedTriggered}
        >
          <View style={{ height: containerSize.height - 10 }}>
            <CacheableImageView source={cover} style={styles.cover} />

            <LinearGradientView
              colors={[
                "#110D21",
                "rgba(17,13,33,0.8)",
                "rgba(17,13,33, 0.5)",
                "rgba(17,13,33,0)",
              ]}
              style={styles.gradient}
            />
          </View>

          <View
            style={{
              bottom: RFValue(42),
              flexDirection: "row",
              alignItems: "flex-end",
              paddingHorizontal: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <MainText numberOfLines={1} bold font="title-6">
                {moment.business_name}
              </MainText>

              <EventDatePreview event={moment} isChatPreview={isChatPreview} />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              {imGoing && (
                <ScaleAnimatedView
                  style={{
                    padding: 5,
                    backgroundColor: theme.colors.main_accent,
                    borderRadius: 10,
                  }}
                >
                  <SquareImage source={icons.Going} side={12} />
                </ScaleAnimatedView>
              )}

              <MomentParticipantsView
                isLarge
                style={{ marginLeft: 12 }}
                participants={participants}
                onPress={onParticipantsPress}
              />
            </View>
          </View>

          <View style={styles.repostContainer}>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <BlurIconButton
                event={moment}
                icon={icons.Repost}
                count={repostsCount}
              />
            </View>
          </View>
        </SwipeableContainer>
      </BounceView>
    </FadeAnimatedView>
  );
};

export default memo(EventCell);

const styles = StyleSheet.create({
  container: {
    marginLeft: 6,
    marginBottom: 12,
    width: width - 12,
    overflow: "hidden",
  },
  cover: StyleSheet.absoluteFillObject,
  gradientContainer: {
    width: "100%",
    position: "absolute",
    bottom: -0.5,
    paddingTop: "20%",
    padding: "3%",
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventDate: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  gradient: {
    width: "100%",
    height: 100,
    position: "absolute",
    bottom: 0,
  },
  repostContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 16,
  },
});

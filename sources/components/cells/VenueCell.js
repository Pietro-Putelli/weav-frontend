import { LinearGradient } from "expo-linear-gradient";
import { pick } from "lodash";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Analytics, analyticTypes } from "../../analytics";
import { SCREENS } from "../../constants/screens";
import { isBusinessOpen } from "../../dates/timetable";
import { useTheme } from "../../hooks";
import {
  pushNavigation,
  showModalNavigation,
  showStackModal,
} from "../../navigation/actions";
import { gradients, icons } from "../../styles";
import { BORDER_RADIUS, VENUE_CELL_HEIGHT } from "../../styles/sizes";
import { formatShareBusiness } from "../../utility/shareApis";
import { BlurIconButton } from "../buttons";
import { CacheableImageView } from "../images";
import SwipeableContainer from "../moments/SwipeableContainer";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");
const CELL_WIDTH = width - 16;

const VenueCell = ({
  venue,
  isRanking,
  componentId,
  style,
  index,
  onReposted,
  ...props
}) => {
  const theme = useTheme();

  const closedAt = useMemo(() => {
    const businessTimetable = venue.timetable;

    if (businessTimetable) {
      const { content } = isBusinessOpen(businessTimetable);

      return content;
    }

    return null;
  }, [venue]);

  const repostsCount = venue?.reposts_count ?? 0;

  const onPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.VenueDetail,
      passProps: { initialBusiness: venue },
    });
  };

  const onLongPress = () => {
    showModalNavigation({
      screen: SCREENS.Share,
      passProps: {
        business: formatShareBusiness(venue),
      },
    });
  };

  const onRepost = () => {
    Analytics.sendEvent(analyticTypes.BEGIN_VENUE_REPOST);

    showStackModal({
      screen: SCREENS.CreateMoment,
      passProps: {
        initialMoment: {
          business_tag: {
            type: "business_tag",
            ...pick(venue, ["id", "name", "cover_source"]),
          },
        },
        onCreated: onReposted,
      },
    });
  };

  return (
    <SwipeableContainer
      activeOffsetX={[-10]}
      onSwipeLeft={onRepost}
      rightIcon={icons.Repost}
    >
      <BounceView
        navigate
        style={[styles.cell, theme.styles.shadow_round, style]}
        activeScale={0.96}
        onPress={onPress}
        onLongPress={onLongPress}
        {...props}
      >
        <CacheableImageView
          source={venue.cover_source}
          style={StyleSheet.absoluteFillObject}
        />

        {!isRanking && (
          <View style={{ position: "absolute", zIndex: 10, right: 8, top: 8 }}>
            <BlurIconButton business={venue} count={repostsCount} />
          </View>
        )}

        <LinearGradient
          end={{ x: 0, y: 0 }}
          start={{ x: 0, y: 1 }}
          colors={gradients.LightShadow}
          style={StyleSheet.absoluteFillObject}
        />

        {isRanking && (
          <View
            style={[
              { backgroundColor: theme.colors.second_background },
              styles.rankContainer,
            ]}
          >
            <MainText bold font="title-4">
              <MainText bold font={"subtitle-2"}>
                #
              </MainText>
              {1 + index}
            </MainText>
          </View>
        )}

        {closedAt !== null && (
          <View style={styles.venueTitle}>
            <MainText
              bold
              font="title-4"
              numberOfLines={1}
              style={{ letterSpacing: 2 }}
            >
              {venue.name}
            </MainText>

            <MainText style={styles.subtitle} font="subtitle-2" bold>
              {closedAt}
            </MainText>
          </View>
        )}
      </BounceView>
    </SwipeableContainer>
  );
};

export default memo(VenueCell);

const styles = StyleSheet.create({
  cell: {
    alignSelf: "center",
    marginBottom: "3%",
    overflow: "hidden",
    width: CELL_WIDTH,
    height: VENUE_CELL_HEIGHT,
    borderRadius: BORDER_RADIUS,
  },
  venueTitle: {
    flex: 1,
    bottom: "5%",
    position: "absolute",
    marginHorizontal: "3%",
    alignSelf: "flex-start",
  },
  subtitle: {
    marginLeft: 4,
  },
  rankContainer: {
    top: -1,
    right: -1,
    position: "absolute",
    padding: 16,
    minWidth: "16%",
    paddingTop: 12,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: BORDER_RADIUS,
  },
});

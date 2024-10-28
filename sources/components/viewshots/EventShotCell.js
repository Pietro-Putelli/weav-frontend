import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { getMMMDDFormat } from "../../dates/dateFormats";
import { formatDate, formatPeriodicDate } from "../../dates/formatters";
import { gradients, icons } from "../../styles";
import { BORDER_RADIUS, ICON_SIZES, MomentCellSize } from "../../styles/sizes";
import { CacheableImageView, SquareImage } from "../images";
import { MainText } from "../texts";
import LinearGradientView from "../views/LinearGradientView";

const ICON_SIDE = ICON_SIZES.one;

const EventShotCell = ({ event, isPreview }) => {
  const eventDate = useMemo(() => {
    const date = formatDate({ date: event.date, format: getMMMDDFormat() });
    const periodicDay = event.periodicDay;

    if (periodicDay) {
      return formatPeriodicDate(periodicDay);
    }

    return date;
  }, [event]);

  const containerStyle = useMemo(() => {
    const scaleFactor = isPreview ? 0.9 : 1;

    return {
      width: MomentCellSize.width * scaleFactor,
      height: MomentCellSize.height * scaleFactor,
      ...styles.container,
    };
  }, [isPreview]);

  return (
    <View style={containerStyle}>
      <CacheableImageView
        source={event.source}
        style={StyleSheet.absoluteFillObject}
      />

      <LinearGradientView
        isFromTop
        colors={gradients.Shadow}
        style={styles.topGradient}
      >
        <MainText bold color="white" font="title-3">
          {event.title}
        </MainText>

        <View style={styles.subtitle}>
          <MainText bold font="subtitle-3" style={{ marginRight: "2%" }}>
            by
          </MainText>
          <MainText color="white" bold font="title-8">
            {event.businessName}
          </MainText>
        </View>
      </LinearGradientView>

      <LinearGradientView
        colors={gradients.Shadow}
        style={styles.bottomGradient}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SquareImage side={ICON_SIDE} source={icons.Marker2} color="white" />
          <MainText
            bold
            color="white"
            font="title-6"
            style={{ marginLeft: "2%", flex: 1 }}
          >
            {event.city}, {eventDate}
          </MainText>
        </View>
      </LinearGradientView>
    </View>
  );
};

export default memo(EventShotCell);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: BORDER_RADIUS,
  },
  topGradient: {
    width: "100%",
    height: "50%",
    padding: "4%",
  },
  bottomGradient: {
    width: "100%",
    position: "absolute",
    bottom: -1,
    height: "40%",
    justifyContent: "flex-end",
    padding: "4%",
  },
  datetimeContainer: {
    marginTop: "4%",
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    marginTop: "1.5%",
    marginLeft: "1.5%",
    flexDirection: "row",
    alignItems: "center",
  },
});

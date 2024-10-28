import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { MAX_EVENT_DISTANCE } from "../../constants/constants";
import { getIsEventLive } from "../../dates/functions";
import { useEventActivity, useTheme } from "../../hooks";
import { BORDER_RADIUS, widthPercentage } from "../../styles/sizes";
import { CheckmarkButton } from "../buttons";
import { CacheableImageView } from "../images";
import { EventDatePreview } from "../moments";
import { MainText } from "../texts";
import { BounceView } from "../views";

const COVER_SIDE = widthPercentage(0.22);

const MyEventsCell = ({ selected, event, onDetailPress }) => {
  const theme = useTheme();

  /*Props*/

  const cellStyle = useMemo(() => {
    return [theme.styles.shadow_round, styles.cell];
  }, []);

  const cellContainerStyle = useMemo(() => {
    return { opacity: 1 };
  }, []);

  return (
    <View style={cellContainerStyle}>
      <BounceView onPress={() => onDetailPress(event)} style={cellStyle}>
        <CacheableImageView source={event.cover} style={styles.cover} />

        <View style={styles.cellContent}>
          <MainText bold font="title-7" numberOfLines={1}>
            {event.title}
          </MainText>

          <View style={{ marginLeft: 4 }}>
            <EventDatePreview
              event={event}
              titleStyle={{ font: "subtitle-1" }}
              style={{ marginLeft: 0, marginTop: "3%" }}
            />
          </View>
        </View>
      </BounceView>
    </View>
  );
};

export default MyEventsCell;

const styles = StyleSheet.create({
  cell: {
    overflow: "hidden",
    marginBottom: "3%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cellContent: {
    flex: 1,
    marginHorizontal: "4%",
    marginVertical: "4%",
  },
  checkmark: {
    marginRight: "2%",
    justifyContent: "center",
  },
  cover: {
    width: COVER_SIDE,
    height: COVER_SIDE,
    borderRadius: BORDER_RADIUS,
  },
});

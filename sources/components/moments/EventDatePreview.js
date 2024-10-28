import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { getEventRelativeDate, getIsEventLive } from "../../dates/functions";
import { MainText } from "../texts";
import { LiveDot } from "../views";

const EventDatePreview = ({ style, event, isChatPreview, titleStyle }) => {
  const formattedDate = getEventRelativeDate({ ...event, showSoonDate: true });
  const isLive = getIsEventLive(event);

  return (
    <View style={[styles.container, { marginTop: isLive ? 8 : 2 }, style]}>
      {isLive ? (
        <LiveDot />
      ) : (
        <MainText
          font={isChatPreview ? "subtitle-1" : "subtitle"}
          {...titleStyle}
        >
          {formattedDate}
        </MainText>
      )}
    </View>
  );
};

export default memo(EventDatePreview);

const styles = StyleSheet.create({
  container: {
    marginLeft: 4,
    flexDirection: "row",
    alignItems: "center",
  },
});

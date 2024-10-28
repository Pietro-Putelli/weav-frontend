import React, { memo } from "react";
import { View } from "react-native";
import { formatTime } from "../../dates/formatters";
import { useLanguages, useTheme } from "../../hooks";
import { MainText } from "../texts";
import { LiveDot } from "../views";

const EventDetailCell = ({ event }) => {
  const theme = useTheme();
  const { dateTimeLanguageContent } = useLanguages();

  const formattedTime = formatTime({ time: event?.end_time, isPlain: true });

  return (
    <View
      style={[
        theme.styles.shadow_round,
        { flexDirection: "row", alignItems: "center", padding: "4%" },
      ]}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <LiveDot />
      </View>
      <MainText font="subtitle" bold>
        {dateTimeLanguageContent.ends_at} {formattedTime}
      </MainText>
    </View>
  );
};

export default memo(EventDetailCell);

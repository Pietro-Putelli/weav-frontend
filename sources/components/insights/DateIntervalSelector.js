import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useLanguages, useTheme } from "../../hooks";
import { CALENDAR_PERIOD_TYPES } from "../calendar/utils";
import { MainText } from "../texts";
import { BounceView } from "../views";

const DateIntervalSelector = ({ selectedPeriod, onChange }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const calendarPeriods = useMemo(() => {
    return [
      {
        title: languageContent.last_7_days,
        type: CALENDAR_PERIOD_TYPES.last7,
      },
      {
        title: languageContent.last_14_days,
        type: CALENDAR_PERIOD_TYPES.last14,
      },
      {
        title: languageContent.last_30_days,
        type: CALENDAR_PERIOD_TYPES.last30,
      },
      {
        title: languageContent.previous_month,
        type: CALENDAR_PERIOD_TYPES.prevMonth,
      },
      {
        title: languageContent.last_80_days,
        type: CALENDAR_PERIOD_TYPES.last80,
      },
    ];
  }, []);

  return (
    <View style={{ marginBottom: "4%" }}>
      <FlatList
        horizontal
        data={calendarPeriods}
        keyExtractor={(item) => item.title}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: { title, type } }) => {
          return (
            <BounceView
              haptic
              onPress={() => {
                onChange({ type, title });
              }}
              style={[
                theme.styles.shadow_round,
                {
                  padding: 12,
                  marginHorizontal: 4,
                  borderColor:
                    selectedPeriod == type
                      ? theme.colors.main_accent
                      : "transparent",
                  borderWidth: 1,
                },
              ]}
            >
              <MainText font="subtitle-1">{title}</MainText>
            </BounceView>
          );
        }}
      />
    </View>
  );
};

export default memo(DateIntervalSelector);

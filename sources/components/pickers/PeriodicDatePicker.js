import React, { memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Switch } from "react-native-gesture-handler";
import { getToday, getWeekDays } from "../../dates/functions";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";
import DatePicker from "./DatePicker";

const PeriodicDatePicker = ({
  value,
  onValueChanged,
  setVisible,
  ...props
}) => {
  const initialIsPeriodic = value?.isPeriodic ?? false;

  const defaultForDate = getToday();
  const defaultForPeriod = getWeekDays()[0];

  const [params, setParams] = useState({
    value: initialIsPeriodic ? defaultForPeriod : defaultForDate,
    isPeriodic: initialIsPeriodic,
  });

  const { isPeriodic } = params;

  const theme = useTheme();
  const { languageContent } = useLanguages();

  const _onValueChanged = (value) => {
    setParams({ ...params, value });
  };

  const onPeriodicChange = () => {
    setParams({
      value: isPeriodic ? defaultForDate : defaultForPeriod,
      isPeriodic: !isPeriodic,
    });
  };

  return (
    <View>
      <DatePicker
        value={params.value}
        isPeriodic={isPeriodic}
        onValueChanged={_onValueChanged}
        {...props}
      />

      <View style={[styles.placeholder, theme.styles.shadow_round]}>
        <MainText style={{ flex: 1, marginRight: 8 }} font="subtitle-2">
          {languageContent.periodic_event_description}
        </MainText>

        <Switch
          trackColor={{ true: theme.colors.main_accent }}
          value={isPeriodic}
          onChange={onPeriodicChange}
        />
      </View>

      <View style={{ marginHorizontal: "2%", marginTop: "6%" }}>
        <SolidButton
          title="done"
          type="done"
          haptic
          icon={icons.Done}
          onPress={() => {
            setVisible(false);

            onValueChanged(params);
          }}
        />
      </View>
    </View>
  );
};

export default memo(PeriodicDatePicker);

const styles = StyleSheet.create({
  placeholder: {
    padding: "4%",
    marginHorizontal: "2%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "4%",
  },
});

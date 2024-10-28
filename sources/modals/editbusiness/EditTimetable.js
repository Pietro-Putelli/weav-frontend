import { cloneDeep } from "lodash";
import moment from "moment/min/moment-with-locales";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, Switch, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { ConfirmView } from "../../components/badgeviews";
import { SolidButton } from "../../components/buttons";
import { TimeInput } from "../../components/inputs";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { WEEK_DAYS } from "../../dates/constants";
import { getWeekDays } from "../../dates/functions";
import { useLanguages, useTheme } from "../../hooks";
import { isTimetable } from "../../utility/validators";

const INITIAL_TIMETABLE_ITEM = { times: ["", "", "", ""], isClosed: false };

const INITIAL_TIMETABLE = {
  mon: INITIAL_TIMETABLE_ITEM,
  tue: INITIAL_TIMETABLE_ITEM,
  wed: INITIAL_TIMETABLE_ITEM,
  thu: INITIAL_TIMETABLE_ITEM,
  fri: INITIAL_TIMETABLE_ITEM,
  sat: INITIAL_TIMETABLE_ITEM,
  sun: INITIAL_TIMETABLE_ITEM,
};

const { width } = Dimensions.get("window");

const EditTimetable = ({ data, setDisabled, onDataChanged }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = WEEK_DAYS[selectedDayIndex];

  const timetable = data?.timetable ?? INITIAL_TIMETABLE;

  const isClosed = timetable[selectedDay].isClosed;

  const { firstSection, secondSection } = useMemo(() => {
    const dayTimetable = timetable[selectedDay];
    const dayTimetableTimes = dayTimetable.times;
    const isClosed = dayTimetable.isClosed;

    const firstSection = {
      index: 0,
      times: dayTimetableTimes.slice(0, 2),
      isClosed,
    };
    const secondSection = {
      index: 1,
      times: dayTimetable.times.slice(2, 4),
      isClosed,
    };

    return { firstSection, secondSection };
  }, [timetable, selectedDay]);

  const [isPasted, setIsPasted] = useState(false);

  const theme = useTheme();
  const { languageContent } = useLanguages();

  const weekdays = useMemo(() => {
    return getWeekDays();
  }, []);

  /* Effects */

  useEffect(() => {
    setDisabled(!isTimetable(timetable));
  }, [timetable]);

  /* Callbacks */

  const onTimeChanged = ({ time, type, sectionIndex }) => {
    let index = 0;

    if (sectionIndex == 0) {
      index = type == "from" ? 0 : 1;
    } else {
      index = type == "from" ? 2 : 3;
    }

    let newTimetable = cloneDeep(timetable);
    newTimetable[selectedDay].times[index] = time;

    onDataChanged({ timetable: newTimetable });
  };

  const onPastePress = () => {
    let newTimetable = cloneDeep(timetable);
    const selected = cloneDeep(newTimetable[selectedDay]);

    WEEK_DAYS.forEach((day) => {
      newTimetable[day] = cloneDeep(selected);
    });

    onDataChanged({ timetable: newTimetable });

    setTimeout(() => {
      setIsPasted(true);
    }, 200);
  };

  const onCleanPress = () => {
    let newTimetable = cloneDeep(timetable);

    newTimetable[selectedDay] = INITIAL_TIMETABLE_ITEM;

    onDataChanged({ timetable: newTimetable });
  };

  const onCloseChange = (isClosed) => {
    let newTimetable = cloneDeep(timetable);

    newTimetable[selectedDay].isClosed = isClosed;

    onDataChanged({ timetable: newTimetable });
  };

  const renderItem = useCallback(
    ({ item: day, index }) => {
      const onDayPress = () => {
        setSelectedDayIndex(index);
      };

      return (
        <BounceView
          haptic
          onPress={onDayPress}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: (width - 16 * 3) / 7,
          }}
        >
          <MainText
            bold
            capitalize
            font="subtitle-1"
            color={
              selectedDayIndex == index
                ? theme.colors.main_accent
                : timetable[index]?.closed
                ? theme.colors.red
                : theme.colors.subtitle
            }
          >
            {day.slice(0, 3)}
          </MainText>
        </BounceView>
      );
    },
    [selectedDayIndex, timetable, timetable]
  );

  return (
    <>
      <ConfirmView
        visible={isPasted}
        setVisible={setIsPasted}
        title={languageContent.buttons.paste}
      />
      <ScrollView scrollEnabled={false}>
        <View style={{ ...theme.styles.shadow_round, padding: "4%" }}>
          <FlatList
            horizontal
            data={weekdays}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={(item) => item}
          />
        </View>
        <View style={[styles.day_container, theme.styles.shadow_round]}>
          <MainText capitalize bold font="subtitle">
            {weekdays[selectedDayIndex]}
          </MainText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MainText
              uppercase
              bold
              font="subtitle-2"
              style={{ marginRight: 12 }}
            >
              {isClosed ? languageContent.closed : languageContent.open}
            </MainText>
            <Switch
              value={isClosed}
              thumbColor={"white"}
              onValueChange={onCloseChange}
              ios_backgroundColor={theme.colors.green}
              trackColor={{ true: theme.colors.red }}
            />
          </View>
        </View>

        <SeparatorTitle marginTop>
          {languageContent.timetable_first_section}
        </SeparatorTitle>

        <TimeInputCell section={firstSection} onTimeChanged={onTimeChanged} />

        <SeparatorTitle marginTop>
          {languageContent.timetable_second_section}
        </SeparatorTitle>

        <TimeInputCell
          allowEmpty
          section={secondSection}
          onTimeChanged={onTimeChanged}
        />

        <View style={styles.buttons}>
          <SolidButton
            title={languageContent.buttons.paste_all}
            style={{ flex: 1, marginRight: "4%" }}
            onPress={onPastePress}
          />
          <SolidButton
            title={languageContent.buttons.clear}
            style={{ flex: 1 }}
            onPress={onCleanPress}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default memo(EditTimetable);

const TimeInputCell = ({ section, allowEmpty, onTimeChanged }) => {
  const [startTime, endTime] = section.times;

  const sharedProps = {
    section,
    onTimeChanged,
    allowEmpty,
    disabled: section.isClosed,
    sectionIndex: section.index,
  };

  return (
    <View style={styles.timeInputContainer}>
      <TimeInput type="from" value={startTime} {...sharedProps} />
      <TimeInput type="to" value={endTime} {...sharedProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  day_container: {
    padding: "4%",
    marginTop: "4%",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: "4%",
    justifyContent: "space-between",
  },
  buttons: {
    marginTop: "8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

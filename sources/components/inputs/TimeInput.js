import { isEmpty, isUndefined } from "lodash";
import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { getBase10MinuteDate } from "../../dates/functions";
import { useLanguages, useTheme } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { MainText } from "../texts";
import { BounceView } from "../views";

const TimeInput = ({
  value,
  type,
  sectionIndex,
  allowEmpty,
  disabled,
  onTimeChanged,
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { completeText, isEmptyTime } = useMemo(() => {
    let response = { isEmptyTime: isUndefined(value) || isEmpty(value) };

    if (response.isEmptyTime) {
      response.completeText = getBase10MinuteDate();
    } else {
      response.completeText = `${value}`;
    }

    return response;
  }, [value]);

  return (
    <BounceView
      disabled={disabled}
      onPress={() => {
        showSheetNavigation({
          screen: SCREENS.DateTimePicker,
          passProps: {
            type: actiontypes.PICKERS.TIME,
            value: completeText,
            allowEmpty,
            onValueChanged: (time) => {
              onTimeChanged({ time, type, sectionIndex });
            },
          },
        });
      }}
      style={[styles.container, theme.styles.shadow_round]}
    >
      <MainText
        uppercase
        isNumbers
        font="subtitle"
        color={isEmptyTime ? theme.colors.placeholderText : theme.colors.text}
      >
        {isEmptyTime ? languageContent[type] : completeText}
      </MainText>
    </BounceView>
  );
};
export default memo(TimeInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    padding: "4%",
  },
});

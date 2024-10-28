import { isUndefined } from "lodash";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { SolidButton } from "../../components/buttons";
import {
  DatePicker,
  DurationPicker,
  PeriodicDatePicker,
  TimePicker,
} from "../../components/pickers";
import { MainText } from "../../components/texts";
import { actiontypes } from "../../constants";
import { getToday, getTomorrow, getWeekDays } from "../../dates/functions";
import { is12HourFormat } from "../../dates/localeUtils";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import ModalScreen from "../ModalScreen";

const { DATE, TIME, DURATION, PERIODIC_DATE } = actiontypes.PICKERS;

const DateTimePickerModal = ({
  type,
  onValueChanged,
  allowEmpty,
  title,
  ...props
}) => {
  const [visible, setVisible] = useState(true);
  const [value, setValue] = useState(props.value);

  const { languageContent } = useLanguages();

  const Picker = useMemo(() => {
    switch (type) {
      case DATE:
        return DatePicker;
      case TIME:
        return TimePicker;
      case DURATION:
        return DurationPicker;
      case PERIODIC_DATE:
        return PeriodicDatePicker;
    }
  }, [type]);

  const defaultValue = useMemo(() => {
    if (type === DATE) {
      return getToday();
    }

    if (type === TIME) {
      is24Hour = !is12HourFormat();

      return is24Hour ? "00:00" : "00:00";
    }
  }, []);

  const onDonePress = () => {
    setVisible(false);

    if (!/\d/.test(value)) {
      onValueChanged(defaultValue);
    } else {
      onValueChanged(value);
    }
  };

  const _onValueChanged = (value) => {
    if (type === PERIODIC_DATE) {
      onValueChanged(value);
    } else {
      setValue(value);
    }
  };

  return (
    <ModalScreen visible={visible} cursor>
      {!isUndefined(title) && (
        <View style={{ alignItems: "center", marginBottom: "2%" }}>
          <MainText font="subtitle">{title}</MainText>
        </View>
      )}

      <Picker
        onValueChanged={_onValueChanged}
        setVisible={setVisible}
        {...props}
      />

      {type !== PERIODIC_DATE && (
        <View
          style={{
            flexDirection: "row",
            marginTop: "6%",
            marginHorizontal: "2%",
            alignItems: "center",
          }}
        >
          <SolidButton
            onPress={onDonePress}
            flex
            haptic
            marginRight={allowEmpty}
            type="done"
            title="done"
            icon={icons.Done}
          />

          {allowEmpty && (
            <SolidButton
              title={languageContent.buttons.leave_empty}
              flex
              onPress={() => {
                setVisible(false);

                onValueChanged("");
              }}
            />
          )}
        </View>
      )}
    </ModalScreen>
  );
};

export default DateTimePickerModal;

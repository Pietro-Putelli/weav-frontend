import React, { memo, useState } from "react";
import { StyleSheet } from "react-native";
import { SolidButton } from "../../components/buttons";
import { DatePicker } from "../../components/pickers";
import { icons } from "../../styles";
import ModalScreen from "../ModalScreen";

const DatePickerModal = ({ date, onDateChanged }) => {
  const [visible, setVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(date);

  return (
    <ModalScreen visible={visible} cursor>
      <DatePicker date={date} onDateChanged={setSelectedDate} />

      <SolidButton
        haptic
        onPress={() => {
          onDateChanged(selectedDate);
          setVisible(false);
        }}
        type="done"
        title="done"
        icon={icons.Done}
        style={styles.button}
      />
    </ModalScreen>
  );
};

export default memo(DatePickerModal);

const styles = StyleSheet.create({
  button: {
    width: "80%",
    marginTop: "6%",
    alignSelf: "center",
  },
  description: {
    marginHorizontal: "2%",
    marginTop: "6%",
  },
});

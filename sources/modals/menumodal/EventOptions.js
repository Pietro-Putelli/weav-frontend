import React, { memo, useState } from "react";
import { View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const EventOptions = ({ setVisible, onDeleted }) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const { languageContent } = useLanguages();

  return (
    <View>
      <SolidButton
        onPress={() => {
          setPopupVisible(true);
        }}
        type="delete"
        title="delete"
        icon={icons.Bin}
      />

      <DoubleOptionPopupModal
        visible={popupVisible}
        setVisible={setPopupVisible}
        onDonePress={() => {
          onDeleted();

          setVisible(false);
        }}
        title={languageContent.popup_contents.delete_event}
      />
    </View>
  );
};

export default memo(EventOptions);

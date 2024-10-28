import React, { memo, useState } from "react";
import { SolidButton } from "../../components/buttons";
import { icons } from "../../styles";
import ModalScreen from "../ModalScreen";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const DeleteButtonModal = ({ config }) => {
  const { title, onDonePress } = config;

  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <ModalScreen cursor>
      <SolidButton
        type="delete"
        title={"delete"}
        icon={icons.Bin}
        onPress={() => {
          setPopupVisible(true);
        }}
      />

      <DoubleOptionPopupModal
        title={title}
        visible={popupVisible}
        onDonePress={onDonePress}
        setVisible={setPopupVisible}
      />
    </ModalScreen>
  );
};

export default memo(DeleteButtonModal);

import React, { memo, useState } from "react";
import { View } from "react-native";
import { reportActivity } from "../../backend/reports";
import { SolidButton } from "../../components/buttons";
import { MainText } from "../../components/texts";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import ModalScreen from "../ModalScreen";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const ReportModal = () => {
  const { languageContent } = useLanguages();

  const [visible, setVisible] = useState(false);
  const [visibleModal, setVisibleModal] = useState(true);

  return (
    <>
      <ModalScreen visible={visibleModal} cursor>
        <View style={{ marginHorizontal: "2%" }}>
          <MainText align="center" font="subtitle-1">
            {languageContent.report_content}
          </MainText>
        </View>

        <SolidButton
          type="delete"
          title="report"
          icon={icons.Flag}
          style={{ marginTop: "6%" }}
          onPress={() => {
            setVisible(true);
          }}
        />
      </ModalScreen>

      <DoubleOptionPopupModal
        title={languageContent.popup_contents.confirm_report}
        visible={visible}
        setVisible={setVisible}
        onDonePress={() => {
          reportActivity(null, () => {
            setVisible(false);
            setVisibleModal(false);
          });
        }}
      />
    </>
  );
};

export default memo(ReportModal);

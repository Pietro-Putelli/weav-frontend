import React, { memo, useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import SpotsAPI from "../../backend/spots";
import { SolidButton } from "../../components/buttons";
import { SingleTitleCell } from "../../components/cells";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const SpotDetails = ({ isMine, spot, setVisible, onDeleted }) => {
  const [popupVisible, setPopupVisible] = useState(false);

  const { languageContent } = useLanguages();

  const dispatch = useDispatch();

  const onDeletedPress = () => {
    dispatch(
      SpotsAPI.deleteMine(spot.id, (isDone) => {
        if (isDone) {
          if (isMine) {
            dispatch(SpotsAPI.deleteMine(spot.id));
          }

          onDeleted?.(spot);
        }

        setVisible(false);
      })
    );
  };

  return (
    <View>
      {isMine ? (
        <>
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
            onDonePress={onDeletedPress}
            title={languageContent.popup_contents.delete_event}
          />
        </>
      ) : (
        <>
          <SingleTitleCell
            icon={icons.Flag}
            title={languageContent.actions.report}
            onPress={() => {
              setVisible(false);

              showSheetNavigation({ screen: SCREENS.Report });
            }}
          />
        </>
      )}
    </View>
  );
};

export default memo(SpotDetails);

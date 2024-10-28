import React, { memo, useCallback, useState } from "react";
import { EventRegister } from "react-native-event-listeners";
import { Navigation } from "react-native-navigation";
import { useDispatch } from "react-redux";
import { deleteMyMoment } from "../../backend/moments";
import { SolidButton } from "../../components/buttons";
import { eventlisteners } from "../../constants";
import { useLanguages } from "../../hooks";
import { deleteUserMomentStateAt } from "../../store/slices/momentsReducer";
import { icons } from "../../styles";
import ModalScreen from "../ModalScreen";
import DoubleOptionPopupModal from "../popups/DoubleOptionPopupModal";

const MyMomentDetailsModal = ({ moment, onDeleted }) => {
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const [popupVisible, setPopupVisible] = useState(false);
  const [visible, setVisible] = useState(true);

  const doneCallback = () => {
    onDeleted?.();

    setVisible(false);

    Navigation.dismissAllModals();
  };

  const onDeletePress = useCallback(() => {
    const momentId = moment.id;

    dispatch(
      deleteMyMoment(momentId, (isDone) => {
        if (isDone) {
          dispatch(deleteUserMomentStateAt(momentId));

          EventRegister.emit(eventlisteners.HOME_SCREEN_LAYOUT);

          doneCallback();
        }
      })
    );
  }, []);

  return (
    <ModalScreen visible={visible} cursor>
      <SolidButton
        type="delete"
        title="delete"
        icon={icons.Bin}
        onPress={() => {
          setPopupVisible(true);
        }}
      />

      <DoubleOptionPopupModal
        onDonePress={onDeletePress}
        title={languageContent.popup_contents.delete_moment}
        visible={popupVisible}
        setVisible={setPopupVisible}
      />
    </ModalScreen>
  );
};

export default memo(MyMomentDetailsModal);

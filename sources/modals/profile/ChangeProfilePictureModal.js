import React, { useState } from "react";
import { SolidButton } from "../../components/buttons";
import { imagesizes } from "../../constants";
import { useLanguages, useProfilePicture, useUser } from "../../hooks";
import { icons } from "../../styles";
import { openPicker } from "../../utility/imagepicker";
import ModalScreen from "../ModalScreen";

const ChangeProfilePictureModal = () => {
  const [visible, setVisible] = useState();

  const { removePicture, changePicture, isLoading } = useProfilePicture();
  const { languageContent } = useLanguages();

  const onChangePicturePress = () => {
    openPicker(
      {
        ...imagesizes.PROFILE,
        cropperCircleOverlay: true,
      },
      (image) => {
        changePicture(image, () => {
          setVisible(false);
        });
      }
    );
  };

  return (
    <ModalScreen visible={visible} cursor>
      <SolidButton
        type="done"
        loading={isLoading}
        onPress={onChangePicturePress}
        title={languageContent.actions.change_picture}
      />
      <SolidButton
        icon={icons.Bin}
        onPress={() => {
          removePicture(() => {
            setVisible(false);
          });
        }}
        title={languageContent.actions.remove_picture}
        style={{ marginTop: "3%" }}
      />
    </ModalScreen>
  );
};

export default ChangeProfilePictureModal;

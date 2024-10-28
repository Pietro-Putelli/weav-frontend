import React, { memo, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { MainTextInput } from "../../components/inputs";
import { useLanguages, useUser } from "../../hooks";
import { triggerHaptic } from "../../utility/haptics";
import { normalizeString } from "../../utility/strings";
import FullSheetModal from "../FullSheetModal";

const EditInstagramModal = () => {
  const user = useUser();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const [instagram, setInstagram] = useState(user?.instagram);

  const onDonePress = () => {
    Keyboard.dismiss();

    dispatch(
      updateUserProfile({ instagram: normalizeString(instagram) }, (succ) => {
        if (succ) {
          navigation.dismissModal();
          triggerHaptic();
        }
      })
    );
  };

  return (
    <FullSheetModal title={languageContent.actions.edit + " instagram"}>
      <MainTextInput
        solid
        autoFocus
        maxLength={32}
        value={instagram}
        placeholder="Instagram username"
        onChangeText={(instagram) => {
          setInstagram(instagram);
        }}
      />

      <SolidButton
        loadingOnPress
        onPress={onDonePress}
        style={styles.button}
        type="done"
        title="done"
      />
    </FullSheetModal>
  );
};

export default memo(EditInstagramModal);

const styles = StyleSheet.create({
  button: {
    marginTop: "6%",
    width: "70%",
    alignSelf: "center",
  },
  disclaimer: {
    marginTop: "6%",
    marginHorizontal: "4%",
  },
});

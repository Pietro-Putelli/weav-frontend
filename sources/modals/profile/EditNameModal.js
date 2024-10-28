import React, { memo, useCallback, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { LoginTextInput } from "../../components/inputs";
import { useLanguages, useUser } from "../../hooks";
import { isName } from "../../utility/validators";
import FullSheetModal from "../FullSheetModal";

const EditNameModal = () => {
  const { name } = useUser();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const [userName, setUserName] = useState(name);
  const isDoneEnabled = isName(userName);

  const onChangeText = useCallback((value) => {
    setUserName(value);
  }, []);

  const onDonePress = () => {
    Keyboard.dismiss();

    dispatch(
      updateUserProfile({ name: userName }, (succ) => {
        succ && navigation.dismissModal();
      })
    );
  };

  return (
    <FullSheetModal title={languageContent.header_titles.edit_name}>
      <LoginTextInput
        autoFocus
        maxLength={32}
        value={userName}
        placeholder="Name"
        onChangeText={onChangeText}
      />

      <SolidButton
        title="Done"
        type="done"
        loadingOnPress
        style={styles.button}
        disabled={!isDoneEnabled}
        onPress={onDonePress}
      />
    </FullSheetModal>
  );
};

export default memo(EditNameModal);

const styles = StyleSheet.create({
  button: {
    marginTop: "6%",
    width: "70%",
    alignSelf: "center",
  },
});

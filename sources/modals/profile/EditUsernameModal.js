import React, { memo, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { UserAPI } from "../../backend";
import { updateUserProfile } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { LoginTextInput } from "../../components/inputs";
import { useLanguages, useSearchFashion, useUser } from "../../hooks";
import { isUsername } from "../../utility/validators";
import FullSheetModal from "../FullSheetModal";

const EditUsernameModal = () => {
  const navigation = useNavigation();
  const { username } = useUser();
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const [isUsernameValid, setIsUsernameValid] = useState(null);

  const onChange = () => {
    if (usernameValue == username) {
      setIsUsernameValid(true);
      return;
    }

    const isUsernameValid = isUsername(usernameValue);

    if (!isUsernameValid) {
      setIsUsernameValid(false);
      return;
    }

    UserAPI.checkUsernameExistence({ username: usernameValue }, (exists) => {
      setIsUsernameValid(!exists);
    });
  };

  const { searchText: usernameValue, onChangeText } = useSearchFashion({
    onChange,
    initialValue: username,
  });

  const onDonePress = () => {
    Keyboard.dismiss();

    dispatch(
      updateUserProfile({ username: usernameValue }, (succ) => {
        succ && navigation.dismissModal();
      })
    );
  };

  return (
    <FullSheetModal title={languageContent.actions.edit + " username"}>
      <LoginTextInput
        autoFocus
        maxLength={32}
        type="username"
        value={usernameValue}
        onChangeText={(value) => {
          setIsUsernameValid(false);
          onChangeText(value);
        }}
        isUsernameValid={isUsernameValid}
      />

      <SolidButton
        title="Done"
        type="done"
        loadingOnPress
        onPress={onDonePress}
        style={styles.button}
        disabled={!isUsernameValid}
      />
    </FullSheetModal>
  );
};
export default memo(EditUsernameModal);

const styles = StyleSheet.create({
  button: {
    marginTop: "6%",
    width: "70%",
    alignSelf: "center",
  },
});

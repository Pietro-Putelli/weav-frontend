import React, { memo, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../backend/profile";
import { SolidButton } from "../../components/buttons";
import { LoginTextInput } from "../../components/inputs";
import { MainText } from "../../components/texts";
import { useUser } from "../../hooks";
import FullSheetModal from "../FullSheetModal";

const EditEmailModal = () => {
  const user = useUser();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState(user.email);

  const onDonePress = () => {
    Keyboard.dismiss();
    dispatch(
      updateUserProfile({ email }, (succ) => {
        succ && navigation.dismissModal();
      })
    );
  };

  return (
    <FullSheetModal title="Edit email">
      <LoginTextInput
        solid
        autoFocus
        maxLength={32}
        type="email"
        value={email}
        placeholder="Contact email"
        onChangeText={(value) => {
          setEmail(String(value).toLocaleLowerCase());
        }}
      />

      <SolidButton
        title="Done"
        type="done"
        loadingOnPress
        onPress={onDonePress}
        style={styles.button}
      />

      <MainText align="center" style={styles.disclaimer} font="subtitle-4">
        Note this is not the email you used to register, you can't change it,
        this email is only for contact purpose.
      </MainText>
    </FullSheetModal>
  );
};

export default memo(EditEmailModal);

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

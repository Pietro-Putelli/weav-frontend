import React, { memo } from "react";
import { View } from "react-native";
import { useSearchFashion } from "../../hooks";
import { LoginTextInput } from "../inputs";

const Username = ({
  user,
  onChangeUsername,
  onChangeName,
  isUsernameValid,
  setEnabled,
}) => {
  const { searchText, onChangeText } = useSearchFashion({
    onChange: ({ value }) => {
      onChangeUsername(value);
    },
    initialValue: user.username,
  });

  return (
    <View>
      <LoginTextInput
        autoFocus
        type="username"
        value={searchText}
        onChangeText={(value) => {
          setEnabled(false);
          onChangeText(value);
        }}
        style={{ marginBottom: "6%" }}
        isUsernameValid={isUsernameValid}
      />
      <LoginTextInput
        value={user.name}
        autoCorrect={false}
        placeholder="Full name"
        onChangeText={onChangeName}
      />
    </View>
  );
};
export default memo(Username);

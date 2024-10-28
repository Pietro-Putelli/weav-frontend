import React from "react";
import { View } from "react-native";
import { useLanguages } from "../../hooks";
import { SolidButton } from "../buttons";
import { LoginTextInput } from "../inputs";
import { FadeErrorView } from "../views";

const Phone = ({
  user,
  isPhoneSelected,
  onSwitchPhone,
  onChangeEmail,
  onChangePhone,
  onChangePhonePrefix,
  phoneError,
  emailError,
}) => {
  const { code, number } = user.phone;

  const { languageContent } = useLanguages();

  const hasError = phoneError || emailError;

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SolidButton
          haptic
          title="email"
          selected={!isPhoneSelected}
          onPress={() => onSwitchPhone(false)}
          style={{ flex: 1, marginRight: "4%" }}
        />
        <SolidButton
          haptic
          title="phone"
          style={{ flex: 1 }}
          selected={isPhoneSelected}
          onPress={() => onSwitchPhone(true)}
        />
      </View>

      <View style={{ marginTop: "6%" }}>
        {isPhoneSelected ? (
          <LoginTextInput
            autoFocus
            value={number}
            onChangeText={onChangePhone}
            type="phone"
            onChangePhonePrefix={onChangePhonePrefix}
            phonePrefix={code}
            placeholder="Mobile number"
          />
        ) : (
          <LoginTextInput
            autoFocus
            value={user.email}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={onChangeEmail}
          />
        )}

        <FadeErrorView style={{ marginTop: "6%" }} visible={hasError}>
          {isPhoneSelected
            ? languageContent.login.phone_already_exists
            : languageContent.login.email_already_exists}
        </FadeErrorView>
      </View>
    </>
  );
};

export default Phone;

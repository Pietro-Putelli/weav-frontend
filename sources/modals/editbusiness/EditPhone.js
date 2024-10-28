import { isEmpty } from "lodash";
import React, { memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { SolidButton } from "../../components/buttons";
import { LoginTextInput } from "../../components/inputs";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";

const DEFAULT_PHONE = {
  number: "",
  code: "+39",
};

const EditPhone = ({ data, changeBusiness }) => {
  const initialPhone = useMemo(() => {
    const phoneNumber = data?.phone?.number;

    if (!isEmpty(phoneNumber) && phoneNumber) {
      return data.phone;
    }
    return DEFAULT_PHONE;
  }, [data]);

  const [phone, setPhone] = useState(initialPhone);

  const { number, code } = phone;

  const { languageContent } = useLanguages();
  const navigation = useNavigation();

  /* Methods */

  const onPhoneChange = useCallback(
    (number) => {
      setPhone({ number, code });
    },
    [code]
  );

  const onChangePhonePrefix = useCallback(
    (code) => {
      setPhone({ number, code });
    },
    [number]
  );

  const onDonePress = () => {
    changeBusiness({ phone });

    navigation.dismissModal();
  };

  const onRemovePress = () => {
    setPhone({ phone: DEFAULT_PHONE });
    changeBusiness({ phone: DEFAULT_PHONE });

    navigation.dismissModal();
  };

  return (
    <View>
      <LoginTextInput
        autoFocus
        type="phone"
        value={number}
        phonePrefix={code}
        keyboardType="number-pad"
        onChangeText={onPhoneChange}
        onChangePhonePrefix={onChangePhonePrefix}
        placeholder={languageContent.phone_number}
      />

      <View style={styles.buttonsContainer}>
        <SolidButton
          flex
          marginRight
          onPress={onDonePress}
          title={languageContent.actions.done}
          icon={icons.Done}
          type="done"
        />
        <SolidButton
          flex
          title={languageContent.actions.remove}
          onPress={onRemovePress}
        />
      </View>
    </View>
  );
};

export default memo(EditPhone);

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: "6%",
    flexDirection: "row",
    alignItems: "center",
  },
});

/*

          {otpSent && (
            <FadeAnimatedView
              style={[
                styles.otp_container,
                { backgroundColor: theme.colors.background },
              ]}
              from={{ translateX: width }}
              animate={{ translateX: otpSent ? 0 : width }}
            >
              <OTPView
                error={error}
                setError={setError}
                resendLoading={resendLoading}
                onCodeFilled={onCodeFilled}
                onResendPress={onResendPress}
                title="We've send you a message, please verify your phone number"
              />
            </FadeAnimatedView>
          )}
 */

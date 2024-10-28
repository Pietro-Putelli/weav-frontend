import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ProfileEndpoints, UserEndpoints } from "../../backend/endpoints";
import { actiontypes } from "../../constants";
import { isPhone } from "../../utility/validators";
import { SolidButton } from "../buttons";
import { LoginTextInput } from "../inputs";
import { FadeView } from "../views";
import OTPView from "./OTPView";

const { REQUEST_OTP } = UserEndpoints;
const { CHECK_PHONE_AND_REQUEST_OTP } = ProfileEndpoints;

const PhoneView = ({
  type,
  error,
  focus,
  phone,
  prefix,
  loading,
  onChange,
  setError,
  onTokenGot,
  onCodeFilled,
}) => {
  const [sendLoading, setSendLoading] = useState();
  const [showOTP, setShowOTP] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { VENUE, USER } = actiontypes.PHONE_MODAL;

  const formattedPhone = `${prefix}${phone}`;

  const textInputRef = useRef();

  useEffect(() => {
    if (focus != false) textInputRef.current?.focus();
  }, [prefix, focus]);

  const onPrefixPress = () => {
    // navigation.navigate({ name: Modals.CountryPicker, merge: true });
  };

  const onSendPress = () => {
    setSendLoading(true);

    if (type == VENUE) {
      // Request otp and get token_value then set show top to true

      axios
        .post(REQUEST_OTP, { username: formattedPhone })
        .then(({ data: { token_value } }) => {
          setShowOTP(true);
          onTokenGot(token_value);
        })
        .catch(() => {
          setPhoneError(true);
          setSendLoading(false);
        });
    } else if (type == USER) {
      axios
        .post(CHECK_PHONE_AND_REQUEST_OTP, { phone: formattedPhone })
        .then(({ data: { token_value } }) => {
          setShowOTP(true);
          onTokenGot(token_value);
        })
        .catch(() => {
          setPhoneError(true);
          setSendLoading(false);
        });
    }
  };

  const onResendPress = () => {
    setError(undefined);

    axios
      .post(REQUEST_OTP, { username: formattedPhone })
      .then(() => {
        setResendLoading(false);
      })
      .catch(() => {
        setResendLoading(false);
      });
  };

  return (
    <View>
      {!showOTP && (
        <View>
          <LoginTextInput
            type="phone"
            error={phoneError}
            ref={textInputRef}
            onChangeText={onChange}
            placeholder="New phone number"
            onPrefixPress={onPrefixPress}
            phonePrefix={prefix}
          />
        </View>
      )}

      <View style={{ alignItems: "center", marginTop: "4%" }}>
        {showOTP ? (
          <FadeView>
            <OTPView
              error={error}
              loading={loading}
              onCodeFilled={onCodeFilled}
              title="A vefication code has been sent to verify your identity"
              setError={setError}
              onResendPress={onResendPress}
              resendLoading={resendLoading}
            />
          </FadeView>
        ) : (
          <SolidButton
            type="done"
            haptic
            loading={sendLoading}
            disabled={!isPhone(phone)}
            title="Send Code"
            onPress={onSendPress}
            style={styles.sendButton}
          />
        )}
      </View>
    </View>
  );
};
export default PhoneView;

const styles = StyleSheet.create({
  inputText: {
    flex: 1,
    marginLeft: "4%",
  },
  sendButton: {
    marginTop: "8%",
    width: "70%",
  },
});

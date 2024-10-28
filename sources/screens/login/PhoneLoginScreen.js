import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import UserAPI from "../../backend/user";
import { FadeAnimatedView } from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { KeyboardAvoidingView } from "../../components/containers";
import { MainTextInput } from "../../components/inputs";
import { MainText } from "../../components/texts";
import { BounceView, FadeErrorView } from "../../components/views";
import { MAX_PHONE_LENGTH } from "../../constants/constants";
import { SCREENS } from "../../constants/screens";
import { saveUserLoginData } from "../../handlers/user";
import { useLanguages, useTheme } from "../../hooks";
import { pushNavigation, showModalNavigation } from "../../navigation/actions";
import {
  getUserLoginData,
  setLoginData,
} from "../../store/slices/utilityReducer";
import { icons } from "../../styles";
import { formatPhone } from "../../utility/formatters";
import { isPhone } from "../../utility/validators";

const PhoneLoginScreen = ({ componentId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { languageContent, setupSystemLanguage } = useLanguages();

  /* Obtained using the token */
  const [tempUser, setTempUser] = useState(null);

  const { phone } = useSelector(getUserLoginData);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlockedAccount, setIsBlockedAccount] = useState(false);

  /* Props */

  const formattedCountry = useMemo(() => {
    return `${phone.code} ${phone.flag}`;
  }, [phone]);

  const isNextEnabled = useMemo(() => {
    return isPhone(phone.number);
  }, [phone]);

  const phoneAlreadyExists = useMemo(() => {
    const phoneNumber = formatPhone({ phone, isPlain: true });

    const tempUserPhone = formatPhone({
      phone: tempUser?.phone,
      isPlain: true,
    });

    return tempUserPhone === phoneNumber;
  }, [phone, tempUser]);

  const isDoneDisabled = !isNextEnabled || isBlockedAccount;

  /* Methods */

  const updatePhoneNumber = (phoneData) => {
    dispatch(setLoginData({ phone: { ...phone, ...phoneData } }));
  };

  /* Callbacks */

  const onPhonePrefixPress = useCallback(() => {
    showModalNavigation({
      screen: SCREENS.CountryPicker,
      passProps: {
        onChangePhonePrefix: (country) => {
          updatePhoneNumber({ code: country.dial_code, flag: country.flag });
        },
      },
    });
  }, [phone]);

  const onChangePhoneNumber = useCallback(
    (number) => {
      updatePhoneNumber({ number });

      setIsBlockedAccount(false);
    },
    [phone]
  );

  const onNextPress = useCallback(() => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    if (phoneAlreadyExists) {
      dispatch(saveUserLoginData(tempUser));
    } else {
      dispatch(
        UserAPI.requestOTP(phone, ({ isSent, isBlocked }) => {
          if (isSent) {
            pushNavigation({
              screen: SCREENS.PhoneVerification,
              componentId,
              options: { popGesture: false },
            });
          } else {
            setIsLoading(false);
            setIsBlockedAccount(isBlocked);
          }
        })
      );
    }
  }, [phone, isLoading]);

  return (
    <SafeAreaView style={theme.styles.container}>
      <KeyboardAvoidingView style={styles.container}>
        <FadeAnimatedView mode="fade-up" style={styles.textsCotainer}>
          <MainText font="title-4" bold>
            {languageContent.login_titles.phone_login}
          </MainText>

          <View style={styles.textInputContainer}>
            <View style={styles.textInputContent}>
              <BounceView
                onPress={onPhonePrefixPress}
                style={[theme.styles.shadow_round, styles.phoneCodeButton]}
              >
                <MainText style={styles.phoneCode}>{formattedCountry}</MainText>
              </BounceView>

              <MainTextInput
                autoFocus
                font="title-6"
                placeholder={languageContent.phone_number}
                clearButtonMode="never"
                textStyle={styles.phoneText}
                style={styles.textInput}
                keyboardType="number-pad"
                maxLength={MAX_PHONE_LENGTH}
                value={phone.number}
                onChangeText={onChangePhoneNumber}
              />
            </View>
          </View>
        </FadeAnimatedView>

        <View style={styles.buttonContainer}>
          <View style={styles.blockedErrorContainer}>
            <FadeErrorView solid visible={isBlockedAccount}>
              {languageContent.login_titles.your_profile_is_blocked}
            </FadeErrorView>
          </View>

          <View style={styles.usernameDescription}>
            <MainText
              font="subtitle-4"
              align="center"
              style={{ lineHeight: 16 }}
              color={theme.colors.secondText}
            >
              {languageContent.login_titles.why_phone_number}
            </MainText>
          </View>

          <SolidButton
            haptic
            type="done"
            loading={isLoading}
            onPress={onNextPress}
            disabled={isDoneDisabled}
            rightIcon={icons.Arrows.Right}
            title={"next"}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default PhoneLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "8%",
  },
  textInputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginLeft: 16,
  },
  textsCotainer: {
    flex: 1,
    paddingHorizontal: "6%",
  },
  buttonContainer: {
    marginBottom: "4%",
    paddingHorizontal: "4%",
  },
  usernameDescription: {
    marginBottom: "5%",
    paddingHorizontal: "4%",
  },
  phoneCode: { fontSize: RFValue(17), fontFamily: "Poppins" },
  phoneText: {
    fontSize: RFValue(24),
    fontFamily: "Poppins",
  },
  phoneCodeButton: {
    padding: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  blockedErrorContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: RFPercentage(14),
  },
});

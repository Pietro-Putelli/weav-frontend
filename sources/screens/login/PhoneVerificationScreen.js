import { isNull, isUndefined, size } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { FadeView, InputStatusView, LoaderView } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import { saveBusinessData } from "../../handlers/business";
import { saveUserLoginData } from "../../handlers/user";
import { useLanguages, useTheme } from "../../hooks";
import {
  pushNavigation,
  setRootScreen,
  showSheetNavigation,
} from "../../navigation/actions";
import { getUserLoginData } from "../../store/slices/utilityReducer";
import { ICON_SIZES } from "../../styles/sizes";

const PhoneVerificationScreen = ({ componentId }) => {
  const inputRef = useRef();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const [otp, setOTP] = useState("");
  const [hasError, setHasError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [countdown, setCountdown] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);

  const { phone, sid } = useSelector(getUserLoginData);

  /* Effects */

  useEffect(() => {
    let intervalId;
    if (countdown > 0 && isDisabled) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
      setIsDisabled(false);
    }
    return () => clearInterval(intervalId);
  }, [countdown, isDisabled]);

  const saveLoginDataForBusiness = (data) => {
    dispatch(saveBusinessData(data, setRootScreen));
  };

  const onChangeOTP = (otp) => {
    setOTP(otp);

    setHasError(null);

    if (size(otp) === 6) {
      setIsLoading(true);

      UserAPI.verifyOTP(
        { phone, otp, sid },
        ({ isVerified, user, business, acceptedTerms }) => {
          if (isVerified) {
            const isBusinessLogin = !isUndefined(business);

            const data = { business, user };

            if (isBusinessLogin) {
              if (acceptedTerms) {
                saveLoginDataForBusiness(data);
              } else {
                showSheetNavigation({
                  screen: SCREENS.BusinessAcceptTerms,
                  passProps: {
                    onPress: () => {
                      UserAPI.acceptTermsForBusiness(
                        user.auth_token,
                        (isDone) => {
                          if (isDone) {
                            saveLoginDataForBusiness(data);
                          }
                        }
                      );
                    },
                  },
                });
              }
            } else {
              if (!user) {
                pushNavigation({
                  componentId,
                  screen: SCREENS.Name,
                  options: { popGesture: false },
                });
              } else {
                dispatch(saveUserLoginData(user));
              }
            }
          } else {
            setHasError(true);
            setIsLoading(false);
          }
        }
      );
    }
  };

  const onResendPress = useCallback(() => {
    setIsDisabled(true);
    setCountdown(30);
    setOTP("");
    setHasError(null);

    dispatch(UserAPI.requestOTP(phone));
  }, []);

  const resendButtonTitle = useMemo(() => {
    const rensedCodeText = languageContent.buttons.resend_code;

    if (countdown === 0) {
      return rensedCodeText;
    }

    return `${rensedCodeText} (${countdown})`;
  }, [countdown]);

  return (
    <SafeAreaView style={theme.styles.container}>
      <KeyboardAvoidingView style={styles.container}>
        <FadeAnimatedView mode="fade-up" style={styles.textsCotainer}>
          <MainText font="title-4" bold>
            {languageContent.login_titles.verify_your_identity}
          </MainText>

          <View style={styles.subtitleContainer}>
            <MainText color={theme.colors.secondText} font="subtitle-1">
              {languageContent.login_titles.please_enter_code}
            </MainText>
          </View>

          <View style={styles.content}>
            <FadeView hidden={isLoading} style={styles.inputContainer}>
              <MainTextInput
                autoFocus
                ref={inputRef}
                font="title-6"
                placeholder="000000"
                clearButtonMode="never"
                textStyle={styles.phoneText}
                keyboardType="number-pad"
                value={otp}
                maxLength={6}
                onChangeText={onChangeOTP}
                style={styles.input}
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
              />

              <FadeView hidden={isNull(hasError)}>
                <InputStatusView valid={!hasError} />
              </FadeView>
            </FadeView>

            <LoaderView
              percentage={0.8}
              style={styles.loader}
              isLoading={isLoading}
            />
          </View>
        </FadeAnimatedView>

        <View style={styles.buttonContainer}>
          <SolidButton
            haptic
            onPress={onResendPress}
            title={resendButtonTitle}
            disabled={isDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "8%",
  },
  textsCotainer: {
    flex: 1,
    paddingHorizontal: "6%",
  },
  phoneText: {
    fontSize: RFValue(30),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "8%",
  },
  subtitleContainer: {
    marginTop: "5%",
    marginLeft: "2%",
  },
  buttonContainer: {
    marginBottom: "4%",
    paddingHorizontal: "4%",
  },
  errorContainer: {
    bottom: RFPercentage(8),
    position: "absolute",
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: -ICON_SIZES.three,
  },
  loader: {
    marginTop: "2%",
  },
});

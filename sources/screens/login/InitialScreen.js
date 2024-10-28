import { MotiView } from "moti";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { useDispatch } from "react-redux";
import { SocialLoginAPI } from "../../backend/";
import { FadeAnimatedView } from "../../components/animations";
import { LoginWithButton, SolidButton } from "../../components/buttons";
import { FullScreenLoader } from "../../components/loaders";
import { MainText, TypeWriters } from "../../components/texts";
import { LinearGradient } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import { loginIfAccountExists, saveUserLoginData } from "../../handlers/user";
import { useLanguages } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { setLoginData } from "../../store/slices/utilityReducer";
import { gradients, icons, insets } from "../../styles";
import { isAndroidDevice } from "../../utility/functions";

const BACKGROUND_SRC = require("../../assets/images/login.png");

const isAndroid = isAndroidDevice();

const { width, height } = Dimensions.get("window");
const LOGIN_SIDE = RFPercentage(14);

const MOMENTS = {
  it: [
    "Serata noisa... chi esce con noi per bere qualcosa? ",
    "Spotto la ragazza con il vestito viola vista all'Aviators ieri sera... ti va uno spritz? ",
    "Chi si unisce a noi per una partita di beach volley? ",
    "Domani c'è l'evento al parco, chi viene con me e @sophie? ",
  ],
  en: [
    "Hey, tonight's a drag... anyone down for a drink? ",
    "Looking for the girl in the purple dress from Aviators Club last night... up for a drink? ",
    "Who's up for some volleyball action today? ",
    "This event's a blast... who's up for it with me and @martina? ",
  ],
};

const InitialScreen = ({ componentId }) => {
  const { setupSystemLanguage, languageContent, locale } = useLanguages();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  /* Effects */

  useEffect(() => {
    SplashScreen.hide();

    setupSystemLanguage();

    dispatch(setLoginData(null));

    return;
    loginIfAccountExists((user) => {
      showSheetNavigation({
        screen: SCREENS.SleekLogin,
        passProps: { user },
      });
    });
  }, []);

  /* Callbacks */

  const onSignUpWithPress = useCallback((method) => {
    SocialLoginAPI.verifyToken(
      method,
      () => {
        setIsLoading(true);
      },
      (response) => {
        if (response !== null) {
          /* Check if the user already exists */

          if (response?.user) {
            dispatch(saveUserLoginData(response.user));
          } else {
            const { email, name } = response;

            dispatch(setLoginData({ email, name }));

            setTimeout(() => {
              pushNavigation({
                componentId,
                screen: SCREENS.Username,
                options: { popGesture: false },
              });
            }, 200);
          }
        } else {
          setIsLoading(false);
        }
      }
    );
  }, []);

  const onSignupAsBusinessPress = useCallback(() => {
    pushNavigation({ componentId, screen: SCREENS.PhoneLogin });
  }, []);

  return (
    <FadeAnimatedView mode="fade" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={BACKGROUND_SRC}
          style={{ width, height, position: "absolute" }}
        />

        <SafeAreaView style={styles.content}>
          <MotiView
            from={{
              translateX: -LOGIN_SIDE * 1.2,
            }}
            animate={{
              translateX: 0,
            }}
            transition={{
              damping: 16,
              delay: 1500,
            }}
          >
            <Image source={icons.AppIcon} style={styles.appIcon} />
          </MotiView>

          <MotiView
            from={{
              translateX: -10,
              translateY: -10,
              opacity: 0,
            }}
            animate={{
              translateX: 0,
              translateY: 0,
              opacity: 1,
            }}
            transition={{
              damping: 8,
              delay: 900,
            }}
          >
            <View style={styles.text}>
              <TypeWriters texts={MOMENTS[locale]} />
            </View>
          </MotiView>
        </SafeAreaView>

        <LinearGradient inverted colors={gradients.Shadow}>
          <FadeAnimatedView delay={400} style={styles.bottomContainer}>
            <View style={{ marginBottom: "5%", marginHorizontal: "1%" }}>
              <MainText
                font="subtitle-3"
                align="center"
                style={{ opacity: 0.8 }}
              >
                {languageContent.login_tagline}
              </MainText>
            </View>

            <View style={styles.buttons}>
              {!isAndroid && (
                <LoginWithButton
                  onPress={() => {
                    onSignUpWithPress("apple");
                  }}
                  style={{ flex: 1, marginRight: 16 }}
                />
              )}

              <LoginWithButton
                type="google"
                style={{ flex: 1 }}
                onPress={() => {
                  onSignUpWithPress("google");
                }}
              />
            </View>

            <SolidButton
              onPress={onSignupAsBusinessPress}
              title={languageContent.login_as_business}
              style={{
                marginTop: "4%",
                width: "100%",
                backgroundColor: "#1a124080",
              }}
            />
          </FadeAnimatedView>
        </LinearGradient>
      </View>

      <FullScreenLoader isLoading={isLoading} />
    </FadeAnimatedView>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: insets.bottom + 16,
    justifyContent: "flex-end",
  },
  text: {
    marginTop: "2%",
    marginHorizontal: "4%",
  },
  appIcon: {
    width: LOGIN_SIDE,
    height: LOGIN_SIDE,
    marginLeft: "1%",
  },
});

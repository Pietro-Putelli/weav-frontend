import React, { useCallback, useMemo, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import UserAPI from "../../backend/user";
import { FadeAnimatedView } from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { KeyboardAvoidingView } from "../../components/containers";
import { MainTextInput } from "../../components/inputs";
import { MainText } from "../../components/texts";
import { MAX_NAME_LENGTH } from "../../constants/constants";
import { SCREENS } from "../../constants/screens";
import { saveBusinessData } from "../../handlers/business";
import { useLanguages, useTheme } from "../../hooks";
import { setRootScreen, showSheetNavigation } from "../../navigation/actions";
import {
  getUserLoginData,
  setLoginData,
} from "../../store/slices/utilityReducer";
import { icons } from "../../styles";
import { isName } from "../../utility/validators";

const NameScreen = ({ componentId }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { phone, name } = useSelector(getUserLoginData);

  const [isLoading, setIsLoading] = useState(false);

  const isDoneEnabled = useMemo(() => {
    return isName(name);
  }, [name]);

  /* Callbacks */

  const onChangeText = useCallback((name) => {
    dispatch(setLoginData({ name }));
  }, []);

  const onBusinessLoginPress = () => {
    Keyboard.dismiss();

    setIsLoading(true);

    showSheetNavigation({
      screen: SCREENS.BusinessAcceptTerms,
      passProps: {
        onPress: () => {
          UserAPI.loginAsBusiness({ name, phone }, ({ business, user }) => {
            const data = { business, user };

            setIsLoading(false);

            dispatch(saveBusinessData(data, setRootScreen));
          });
        },
        onGoBack: () => {
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <SafeAreaView style={theme.styles.container}>
      <KeyboardAvoidingView style={styles.container}>
        <FadeAnimatedView style={styles.textsCotainer}>
          <MainText font="title-4" bold>
            {languageContent.login_titles.name_login}
          </MainText>

          <MainText
            font="subtitle-1"
            style={styles.subtitle}
            color={theme.colors.secondText}
          >
            {languageContent.first_and_last_name}
          </MainText>

          <View style={styles.content}>
            <MainTextInput
              autoFocus
              value={name}
              font="title-4"
              autoCorrect={false}
              blurOnSubmit={false}
              autoCapitalize="words"
              clearButtonMode="never"
              onChangeText={onChangeText}
              maxLength={MAX_NAME_LENGTH}
              textStyle={styles.textInput}
              style={styles.textInputContainer}
              placeholder={languageContent.login_titles.your_name}
            />
          </View>
        </FadeAnimatedView>

        <View style={styles.buttonContainer}>
          <SolidButton
            haptic
            type="done"
            title={"done"}
            loading={isLoading}
            disabled={!isDoneEnabled}
            rightIcon={icons.Arrows.Right}
            onPress={onBusinessLoginPress}
          />

          {/* <TitleButton
            loading={isLoading}
            disabled={!isDoneEnabled}
            style={styles.loginAsBusiness}
            onPress={onBusinessLoginPress}
            title={languageContent.or_login_as_business}
            titleProps={{ font: "subtitle-3", uppercase: true, bold: true }}
          /> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default NameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "8%",
  },
  textsCotainer: {
    flex: 1,
    paddingHorizontal: "6%",
  },
  buttonContainer: {
    marginBottom: "4%",
    paddingHorizontal: "4%",
    marginTop: "5%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    width: "100%",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: { textAlign: "center" },
  loginAsBusiness: {
    marginTop: "1%",
  },
  subtitle: {
    marginTop: "3%",
    marginLeft: "2%",
  },
});

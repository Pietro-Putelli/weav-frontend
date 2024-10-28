import { isEmpty } from "lodash";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import UserAPI from "../../backend/user";
import { FadeAnimatedView } from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { KeyboardAvoidingView } from "../../components/containers";
import { MainTextInput } from "../../components/inputs";
import { MainText } from "../../components/texts";
import { FadeView, InputStatusView } from "../../components/views";
import {
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from "../../constants/constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useSearchFashion, useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { setLoginData } from "../../store/slices/utilityReducer";
import { icons } from "../../styles";
import { isValidText } from "../../utility/validators";

/*
  isProfileSignup = signup from business profile screen
*/

const UsernameScreen = ({ componentId, isProfileSignup }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isDoneEnabled, setIsDoneEnabled] = useState(false);

  const onChange = useCallback(({ value }) => {
    dispatch(setLoginData({ username: value }));

    setIsDoneEnabled(false);

    const isValidUsername = isValidText({
      text: value,
      noSpaces: true,
      minLength: MIN_USERNAME_LENGTH,
    });

    if (isValidUsername) {
      UserAPI.checkUsernameExistence({ username: value }, (exists) => {
        setIsDoneEnabled(!exists);
        setIsUsernameValid(!exists);
      });
    } else {
      setIsUsernameValid(false);
    }
  }, []);

  const { searchText, onChangeText } = useSearchFashion({ onChange });

  const isSearchEmpty = isEmpty(searchText);

  /* Callbacks */

  const onDonePress = useCallback(() => {
    pushNavigation({
      componentId,
      name: SCREENS.ProfilePictureLogin,
      passProps: { isProfileSignup },
    });
  }, []);

  return (
    <SafeAreaView style={theme.styles.container}>
      <KeyboardAvoidingView style={styles.container}>
        <FadeAnimatedView mode="fade-up" style={styles.textsCotainer}>
          <MainText font="title-4" bold>
            {languageContent.login_titles.choose_username}
          </MainText>

          <MainText
            font="subtitle-1"
            style={styles.subtitle}
            color={theme.colors.secondText}
          >
            {languageContent.login_titles.username_must_be_unique}
          </MainText>

          <View style={styles.content}>
            <View style={styles.textContainer}>
              <MainTextInput
                autoFocus
                font="title-5"
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="never"
                maxLength={MAX_USERNAME_LENGTH}
                style={styles.textInput}
                onChangeText={onChangeText}
                value={searchText}
                placeholder={languageContent.login_titles.your_username}
              />

              <FadeView hidden={isSearchEmpty}>
                <InputStatusView
                  style={{ marginLeft: 8 }}
                  valid={isUsernameValid}
                />
              </FadeView>
            </View>
          </View>
        </FadeAnimatedView>

        <View style={styles.buttonContainer}>
          <SolidButton
            haptic
            type="done"
            title={"next"}
            onPress={onDonePress}
            disabled={!isDoneEnabled}
            style={{ marginTop: "5%" }}
            rightIcon={icons.Arrows.Right}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default UsernameScreen;

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
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "18%",
  },
  errorContainer: {
    alignSelf: "center",
  },
  subtitle: {
    marginTop: "3%",
    marginLeft: "2%",
  },
});

import { Video } from "expo-av";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { FadeAnimatedView } from "../../components/animations";
import { SolidButton, TitleButton } from "../../components/buttons";
import { MainText } from "../../components/texts";
import { LinearGradient } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import { userLogOut } from "../../handlers/user";
import { useLanguages, useUser } from "../../hooks";
import { pushNavigation, showSheetNavigation } from "../../navigation/actions";
import { gradients, icons, insets } from "../../styles";

const InitialBusinessScreen = ({ componentId }) => {
  const user = useUser();
  const { languageContent } = useLanguages();

  const dispatch = useDispatch();

  const onLogoutPress = () => {
    dispatch(userLogOut());
  };

  const onCreatePress = () => {
    showSheetNavigation({ screen: SCREENS.ChooseBusinessToCreate });
  };

  const onLoginWithUserPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.Username,
      passProps: {
        isProfileSignup: true,
      },
    });
  };

  return (
    <FadeAnimatedView style={styles.container}>
      <Video
        shouldPlay
        isLooping
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
        source={require("../../assets/videos/business.mp4")}
      />

      <LinearGradient
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 1 }}
        colors={gradients.Shadow}
        style={styles.gradientContent}
      >
        <FadeAnimatedView
          delay={200}
          mode="fade-up"
          style={styles.titleContainer}
        >
          <MainText font="title-4" bold>
            Hey {user.name.split(" ")[0]}{" "}
            {languageContent.login_titles.welcome_to_weav}
          </MainText>
        </FadeAnimatedView>

        <FadeAnimatedView delay={400} style={{ alignItems: "center" }}>
          <MainText
            align="center"
            bold
            font="title-5"
            style={styles.textContent}
          >
            {languageContent.login_titles.business_caption}
          </MainText>

          <View style={{ marginTop: "6%" }}>
            <SolidButton
              icon={icons.Profits}
              title={languageContent.buttons.create_your_business}
              type="done"
              onPress={onCreatePress}
            />

            <View style={styles.buttonsContainer}>
              <TitleButton
                title={languageContent.buttons.login_as_user}
                onPress={onLoginWithUserPress}
                style={[styles.logoutButton, { marginRight: 20 }]}
                titleProps={{ font: "subtitle-2", uppercase: true, bold: true }}
              />

              <TitleButton
                title={languageContent.buttons.logout}
                onPress={onLogoutPress}
                style={styles.logoutButton}
                titleProps={{ font: "subtitle-2", uppercase: true, bold: true }}
              />
            </View>
          </View>
        </FadeAnimatedView>
      </LinearGradient>
    </FadeAnimatedView>
  );
};

export default InitialBusinessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    position: "absolute",
    top: insets.top + 8,
    left: "6%",
  },
  textContent: {
    marginTop: "6%",
    paddingHorizontal: "2%",
  },
  logoutButton: {
    marginTop: "2%",
  },
  gradientContent: {
    justifyContent: "flex-end",
    paddingBottom: insets.bottom + 16,
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: "4%",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

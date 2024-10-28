import React, { memo } from "react";
import { View } from "react-native";
import HyperLink from "react-native-hyperlink";
import {
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL,
} from "../../backend/urls";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { MainText } from "../texts";

const TermsView = () => {
  const theme = useTheme();

  const { languageContent } = useLanguages();
  const languageContentLogin = languageContent.login_titles;

  const showModal = (url) => {
    showModalNavigation({
      screen: SCREENS.Web,
      passProps: {
        isModal: true,
        url,
      },
    });
  };

  const textColor = theme.colors.secondText;

  return (
    <View
      style={{ marginTop: "4%", paddingHorizontal: "2%", alignItems: "center" }}
    >
      <HyperLink
        onPress={() => {
          showModal(TERMS_AND_CONDITIONS_URL);
        }}
        linkText={(url) =>
          url === TERMS_AND_CONDITIONS_URL ? languageContentLogin.terms : url
        }
        linkStyle={{ color: theme.colors.aqua }}
      >
        <MainText color={textColor} font="subtitle-4" align="center">
          {languageContentLogin.by_signin} {TERMS_AND_CONDITIONS_URL}.
        </MainText>
      </HyperLink>

      <HyperLink
        onPress={() => {
          showModal(PRIVACY_POLICY_URL);
        }}
        style={{ marginTop: "1%" }}
        linkText={(url) =>
          url === PRIVACY_POLICY_URL ? "Privacy Policy" : url
        }
        linkStyle={{ color: theme.colors.aqua }}
      >
        <MainText color={textColor} align="center" font="subtitle-4">
          {languageContentLogin.learn_how_we_collect_data} {PRIVACY_POLICY_URL}.
        </MainText>
      </HyperLink>
    </View>
  );
};

export default memo(TermsView);

import React from "react";
import { View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { SquareImage } from "../../components/images";
import { TermsView } from "../../components/register";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import ModalScreen from "../ModalScreen";

const ICON_SIDE = widthPercentage(0.3);

const BusinessAcceptTermsModal = ({ onPress, onGoBack }) => {
  const { languageContent } = useLanguages();

  return (
    <ModalScreen
      cursor
      onGoBack={onGoBack}
      title={languageContent.login_as_business}
    >
      <View
        style={{ alignItems: "center", marginTop: "4%", marginBottom: "2%" }}
      >
        <SquareImage side={ICON_SIDE} source={icons.ColoredBar} coloredIcon />
      </View>

      <TermsView />

      <View style={{ marginTop: "4%" }}>
        <SolidButton
          type="done"
          loadingOnPress
          onPress={onPress}
          title={languageContent.buttons.join_and_accept}
        />
      </View>
    </ModalScreen>
  );
};

export default BusinessAcceptTermsModal;

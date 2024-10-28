import Clipboard from "@react-native-clipboard/clipboard";
import React, { useState } from "react";
import { ConfirmView } from "../../components/badgeviews";
import { SolidButton } from "../../components/buttons";
import { SingleTitleCell } from "../../components/cells";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { safeOpenUrl } from "../../utility/linking";
import ModalScreen from "../ModalScreen";
import { isAndroidDevice } from "../../utility/functions";

const isAndroid = isAndroidDevice();

const MapSelectorModal = ({ coordinate, address, name }) => {
  const { longitude, latitude } = coordinate;

  const [visible, setVisible] = useState();
  const [copied, setCopied] = useState(false);

  const { languageContent } = useLanguages();

  const onApplePress = () => {
    safeOpenUrl(`maps://?ll=${latitude},${longitude}&q=${name}`);
  };

  const onGooglePress = () => {
    const googleMapsApple = `comgooglemaps://?center=${latitude},${longitude}&q=${latitude},${longitude}&label=${name}`;
    const googleMapsAndroid = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${name})`;

    safeOpenUrl(isAndroid ? googleMapsAndroid : googleMapsApple);
  };

  const onCopyPress = () => {
    Clipboard.setString(address);
    setCopied(true);

    setTimeout(() => {
      setVisible(false);
    }, 500);
  };

  return (
    <>
      <ModalScreen visible={visible} cursor>
        {!isAndroid && (
          <SingleTitleCell
            coloredIcon
            title="Apple Maps"
            onPress={onApplePress}
            icon={require("../../assets/icons/apple.maps.png")}
          />
        )}

        <SingleTitleCell
          coloredIcon
          title="Google maps"
          onPress={onGooglePress}
          icon={require("../../assets/icons/google.maps.png")}
        />

        <SolidButton
          haptic
          type="done"
          icon={icons.Copy}
          title={languageContent.actions.copy_address}
          onPress={onCopyPress}
          style={{ marginTop: "8%" }}
        />
      </ModalScreen>
      <ConfirmView title="copied" visible={copied} setVisible={setCopied} />
    </>
  );
};

export default MapSelectorModal;

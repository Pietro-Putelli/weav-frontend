import React, { useState } from "react";
import { View } from "react-native";
import { SquareImage } from "../../components/images";
import { Hairline } from "../../components/separators";
import { SocialShareList } from "../../components/shares";
import { MainText } from "../../components/texts";
import shareOptions from "../../constants/shareOptions";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import {
  copyLinkFor,
  shareMore,
  shareOnTelegram,
  shareOnWhatsApp,
} from "../../utility/shareApis";
import ModalScreen from "../ModalScreen";
import { ConfirmView } from "../../components/badgeviews";

const LOGO_SIDE = widthPercentage(0.5);

const InviteFriendsModal = () => {
  const { languageContent } = useLanguages();

  const shareContent = "Where Great Things Happen - weav.it";

  const [visibleBadge, setVisibleBadge] = useState(false);

  const onPress = (shareType) => {
    switch (shareType) {
      case shareOptions.WHATSAPP:
        shareOnWhatsApp({
          text: shareContent,
        });
        break;

      case shareOptions.TELEGRAM:
        shareOnTelegram({ text: shareContent });
        break;

      case shareOptions.COPY:
        copyLinkFor({ text: "weav.it" });
        setVisibleBadge(true);
        break;

      case shareOptions.MORE:
        shareMore({ text: shareContent });
    }
  };

  return (
    <>
      <ModalScreen cursor>
        <View style={{ alignItems: "center" }}>
          <SquareImage
            source={icons.AppIcon}
            style={{ height: LOGO_SIDE * 0.7 }}
            coloredIcon
            side={LOGO_SIDE}
          />

          <MainText bold style={{ marginVertical: "4%" }} font="title-7">
            {languageContent.invite_your_friends_on_weav}
          </MainText>

          <Hairline />

          <SocialShareList
            onPress={onPress}
            scrollEnabled={false}
            disableReport
          />
        </View>
      </ModalScreen>

      <ConfirmView
        title={languageContent.action_feedbacks.copied}
        visible={visibleBadge}
        setVisible={setVisibleBadge}
      />
    </>
  );
};

export default InviteFriendsModal;

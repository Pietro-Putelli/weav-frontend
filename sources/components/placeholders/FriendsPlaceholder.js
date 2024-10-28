import React from "react";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { PLACEHOLDER_HEIGHT, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const ICON_SIDE = widthPercentage(0.3);

const FriendsPlaceholder = () => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: PLACEHOLDER_HEIGHT,
      }}
    >
      <SquareImage source={icons.ColoredFriends} coloredIcon side={ICON_SIDE} />

      <MainText align="center" font="subtitle" style={{ marginTop: "4%" }}>
        {languageContent.placeholders.no_friends_yet}
      </MainText>

      <SolidButton
        type="done"
        icon={icons.ShareOutside}
        style={{ marginTop: "4%", width: "80%" }}
        title={languageContent.invite_your_friends}
        onPress={() => {
          showSheetNavigation({
            screen: SCREENS.InviteFriends,
          });
        }}
      />
    </FadeAnimatedView>
  );
};

export default FriendsPlaceholder;

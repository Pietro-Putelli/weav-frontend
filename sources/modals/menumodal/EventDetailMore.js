import React, { memo } from "react";
import { View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { SingleTitleCell } from "../../components/cells";
import { MainText } from "../../components/texts";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { contactSupportTeam } from "../../utility/shareApis";

const EventDetailMore = () => {
  const { languageContent } = useLanguages();

  return (
    <View>
      <SingleTitleCell
        icon={icons.Flag}
        title={languageContent.actions.report}
        onPress={() => {
          showSheetNavigation({ screen: SCREENS.Report });
        }}
      />

      <View style={{ marginLeft: "2%", marginRight: "4%", marginTop: "6%" }}>
        <MainText font="subtitle-3">
          {languageContent.event_disclaimer}
        </MainText>
      </View>

      <SolidButton
        style={{ marginTop: "4%" }}
        title={languageContent.buttons.contact_us}
        onPress={() => {
          contactSupportTeam();
        }}
      />
    </View>
  );
};

export default memo(EventDetailMore);

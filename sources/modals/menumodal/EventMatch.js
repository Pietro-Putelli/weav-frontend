import React from "react";
import { View } from "react-native";
import { SingleTitleCell } from "../../components/cells";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";

const EventMatch = ({ onLeftPress, setVisible }) => {
  const { languageContent } = useLanguages();

  return (
    <View>
      <SingleTitleCell
        icon={icons.Cross}
        title="leave event"
        onPress={() => {
          setVisible(false);
          onLeftPress();
        }}
      />

      <SingleTitleCell
        icon={icons.Flag}
        title={languageContent.actions.report}
        onPress={() => {
          showSheetNavigation({ screen: SCREENS.Report });
        }}
      />
    </View>
  );
};

export default EventMatch;

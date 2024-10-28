import React, { memo } from "react";
import { View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { MainText } from "../../components/texts";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { icons } from "../../styles";

const UserTagEventActions = ({ onRemoveTagPress }) => {
  const { languageContent } = useLanguages();

  return (
    <View>
      <View style={{ marginBottom: "6%", marginHorizontal: "2%" }}>
        <MainText font="subtitle-1" align="center">
          {languageContent.remove_mention_content}
        </MainText>
      </View>

      <View style={{ flexDirection: "row" }}>
        <SolidButton
          flex
          marginRight
          type="delete"
          title="remove"
          icon={icons.Cross}
          onPress={onRemoveTagPress}
        />
        <SolidButton
          onPress={() => {
            showSheetNavigation({ screen: SCREENS.Report });
          }}
          flex
          title="report"
          icon={icons.Flag}
        />
      </View>
    </View>
  );
};

export default memo(UserTagEventActions);

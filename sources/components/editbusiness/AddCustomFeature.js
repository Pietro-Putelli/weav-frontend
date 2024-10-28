import React from "react";
import { View } from "react-native";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { BUTTON_HEIGHT } from "../../styles/sizes";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";

const AddCustomFeature = ({ customCount, onAddCustomPress }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "4%",
        marginHorizontal: "1%",
      }}
    >
      {customCount > 0 && (
        <View
          style={[
            {
              flex: 1,
              alignItems: "center",
              height: BUTTON_HEIGHT,
              justifyContent: "center",
              marginRight: "2%",
            },
            theme.styles.shadow_round,
          ]}
        >
          <MainText font="subtitle" bold>
            {customCount} custom
          </MainText>
        </View>
      )}
      <SolidButton
        flex
        icon={icons.Add}
        title={languageContent.buttons.add_custom}
        onPress={onAddCustomPress}
      />
    </View>
  );
};

export default AddCustomFeature;

import React, { memo, useEffect, useState } from "react";
import { View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { MainTextInput } from "../../components/inputs";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { isValidText } from "../../utility/validators";

const EditTitle = ({ data, onDataChanged, onDonePress }) => {
  const businessName = data.name;

  const [disabled, setDisabled] = useState(true);

  const { languageContent } = useLanguages();

  useEffect(() => {
    setDisabled(!isValidText({ text: businessName }));
  }, [businessName]);

  return (
    <View>
      <MainTextInput
        solid
        autoFocus
        maxLength={32}
        value={data?.name}
        maxNumberOfLines={4}
        autoCorrect={false}
        placeholder={languageContent.name?.capitalize()}
        onChangeText={(name) => {
          onDataChanged({ name });
        }}
      />

      <SolidButton
        haptic
        type="done"
        title="done"
        icon={icons.Done}
        disabled={disabled}
        onPress={onDonePress}
        style={{ marginTop: "6%" }}
      />
    </View>
  );
};

export default memo(EditTitle);

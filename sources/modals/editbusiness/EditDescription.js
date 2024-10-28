import { pick } from "lodash";
import React, { memo } from "react";
import { Dimensions, View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { MainTextInput, TextView } from "../../components/inputs";
import { PriceSelector } from "../../components/selectors";
import { useLanguages } from "../../hooks";
import { icons, typographies } from "../../styles";

const { height } = Dimensions.get("window");

const EditDescription = ({
  data,
  onDataChanged,
  onDonePress,
  business,
  isEventProfile,
}) => {
  const initialData = pick(
    business,
    "description",
    "nearby_info",
    "price_target"
  );

  const { languageContent } = useLanguages();

  const onChange = (key, value) => {
    onDataChanged({ ...initialData, ...data, [key]: value });
  };

  return (
    <View style={{ flex: 1 }}>
      <TextView
        solid
        clearButton
        height={height / 6}
        value={data.description}
        onChangeText={(value) => onChange("description", value)}
        placeholder={languageContent.add_business_description_placeholder}
        textStyle={{ fontSize: typographies.fontSizes.subtitle }}
      />

      {!isEventProfile && (
        <>
          <MainTextInput
            solid
            coloredIcon
            autoCorret={false}
            autoComplete="off"
            value={data.nearby_info}
            icon={icons.ColoredMap}
            style={{ marginTop: "4%" }}
            placeholder={languageContent.extra_info_about_location}
            onChangeText={(value) => onChange("nearby_info", value)}
          />
        </>
      )}

      <PriceSelector
        solid
        showText
        price={data.price_target}
        style={{ marginTop: "4%" }}
        onChange={(value) => onChange("price_target", value)}
      />

      <SolidButton
        haptic
        type="done"
        title="done"
        icon={icons.Done}
        onPress={onDonePress}
        style={{ marginTop: "6%" }}
      />
    </View>
  );
};

export default memo(EditDescription);

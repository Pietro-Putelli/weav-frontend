import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { useLanguages, useTheme } from "../../hooks";
import { insets, typographies } from "../../styles";
import FullSheetModal from "../FullSheetModal";
import { getFlagEmojiForCountryCode } from "../../utility/phone";

const CELL_HEIGHT = RFPercentage(7);

const COUNTRIES = require("../../json/countries.json");

const CountryPickerModal = ({ componentId, onChangePhonePrefix }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const formattedCountries = useMemo(() => {
    return COUNTRIES.map((country) => {
      return {
        ...country,
        flag: getFlagEmojiForCountryCode(country.code),
      };
    });
  }, []);

  const [countries, setCountries] = useState(formattedCountries);

  const onSearch = (text) => {
    let _countries = formattedCountries;

    if (text != "")
      _countries = formattedCountries.filter((country) =>
        country.name.includes(text)
      );

    setCountries(_countries);
  };

  const onCountryPress = (country) => {
    onChangePhonePrefix(country);
    Navigation.dismissModal(componentId);
  };

  const keyExtractor = useCallback((item) => {
    return item.name;
  }, []);

  const renderItem = useCallback(
    ({ item: country }) => {
      return (
        <BounceView
          haptic
          style={[styles.cellContainer, theme.styles.shadow_round]}
          onPress={() => onCountryPress(country)}
        >
          <Text
            style={{
              fontSize: typographies.fontSizes.title4,
              marginRight: 16,
            }}
          >
            {country.flag}
          </Text>
          <MainText font="subtitle" numberOfLines={1} style={{ flex: 1 }}>
            {country.name}
          </MainText>
          <MainText font="subtitle" style={{ marginLeft: "4%" }}>
            ({country.dial_code})
          </MainText>
        </BounceView>
      );
    },
    [countries]
  );

  return (
    <FullSheetModal removePadding>
      <View style={{ marginHorizontal: 8 }}>
        <SolidSearchBar
          onChangeText={onSearch}
          placeholder={languageContent.search_for_country}
        />
      </View>

      <View style={{ marginTop: "4%", flex: 1 }}>
        <AdvancedFlatList
          estimatedItemSize={CELL_HEIGHT}
          data={countries}
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: insets.bottom,
          }}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </FullSheetModal>
  );
};
export default CountryPickerModal;

const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "6%",
    marginVertical: 4,
    height: CELL_HEIGHT,
    marginHorizontal: 8,
  },
});

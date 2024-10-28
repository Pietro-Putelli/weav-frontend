import React, { memo } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { MainText } from "../texts";

import { Theme } from "themes";
import { useTheme } from "../../hooks";

const countries = require("../../files/countries.json");

const { width } = Dimensions.get("window");

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const CountryCell = ({ item, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.cellContainer, theme.styles.shadow_round]}
      onPress={() => onPress(item.dial_code)}
    >
      <Text style={{ fontSize: 40, marginRight: 16 }}>
        {getFlagEmoji(item.code)}
      </Text>
      <MainText font="subtitle" style={{ flex: 1 }} adjustsFontSizeToFit={true}>
        {item.name}
      </MainText>

      <MainText
        align="right"
        font="subtitle"
        style={{ flex: 1 }}
        color={theme.colors.main_accent}
      >
        {item.dial_code}
      </MainText>
    </TouchableOpacity>
  );
};

const CountryPicker = ({ onPress }) => {
  return (
    <FlatList
      data={countries}
      style={{ marginTop: 32 }}
      keyboardDismissMode="on-drag"
      keyExtractor={(item) => item.name}
      contentContainerStyle={{ alignItems: "center" }}
      renderItem={({ item }) => <CountryCell {...{ item, onPress }} />}
    />
  );
};
export default memo(CountryPicker);

const styles = StyleSheet.create({
  cellContainer: {
    padding: "3%",
    width: width * 0.9,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
});

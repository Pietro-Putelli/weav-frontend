import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { LocationCell } from "../../components/cells";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { useLanguages, useSearchFashion } from "../../hooks";
import { coordinateToArray } from "../../utility/formatters";
import { geoCode } from "../../utility/geolocation";
import FullSheetModal from "../FullSheetModal";
import { TAB_BAR_HEIGHT } from "../../styles/sizes";

const AddLocationModal = ({ onGoBack }) => {
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const [locations, setLocations] = useState([]);

  const fetchPlaces = () => {
    geoCode(
      {
        value: searchText,
        types: ["place", "locality", "neighborhood", "poi"],
      },
      (locations) => {
        setLocations(locations);
      }
    );
  };

  const { searchText, onChangeText, isLoading } = useSearchFashion({
    onChange: fetchPlaces,
  });

  const onLocationPress = (location) => {
    navigation.dismissModal();

    const { coordinate, text } = location;
    onGoBack({
      type: "location_tag",
      coordinate: coordinateToArray(coordinate),
      value: text,
    });
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <LocationCell location={item} onPress={() => onLocationPress(item)} />
      );
    },
    [onLocationPress]
  );

  return (
    <FullSheetModal>
      <SolidSearchBar
        autoFocus
        isLoading={isLoading}
        onChangeText={onChangeText}
        placeholder={languageContent.text_placeholders.search_for_places}
      />

      <View style={styles.content}>
        <AdvancedFlatList
          enabledAnimation
          data={locations}
          renderItem={renderItem}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
        />
      </View>
    </FullSheetModal>
  );
};
export default AddLocationModal;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: "4%",
  },
  cell_container: {
    padding: "4%",
    marginVertical: "1%",
    flexDirection: "row",
    alignItems: "center",
  },
});

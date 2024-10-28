import _ from "lodash";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import { LocationCell } from "../../components/cells";
import { SearchRecentHeader } from "../../components/headers";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { NotFoundPlaceholder } from "../../components/placeholders";
import { useLanguages, useSearchFashion } from "../../hooks";
import FullSheetModal from "../../modals/FullSheetModal";
import { setRecentSearch } from "../../store/slices/utilityReducer";
import { geoCode } from "../../utility/geolocation";
import { TAB_BAR_HEIGHT } from "../../styles/sizes";

const SearchScreen = ({ onDismiss, mode, onLocationPress }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isNotFound, setIsNotFound] = useState(false);

  const { languageContent } = useLanguages();

  const placeholder = languageContent.text_placeholders.search_for_city;

  const search = () => {
    geoCode({ value: searchText, types: ["place"] }, (data) => {
      setItems(data);

      setIsNotFound(_.isEmpty(data) && !_.isEmpty(searchText));
    });
  };

  const [items, setItems] = useState([]);
  const { isLoading, searchText, onChangeText } = useSearchFashion({
    onChange: search,
  });

  /* Methods */

  const _onLocationPress = (location) => {
    onLocationPress(location);

    dispatch(setRecentSearch(location));

    navigation.dismissModal();
  };

  /* Components */

  const renderItem = useCallback(({ item }) => {
    return <LocationCell location={item} onPress={_onLocationPress} />;
  }, []);

  return (
    <FullSheetModal onDismiss={onDismiss}>
      <SolidSearchBar
        autoFocus
        value={searchText}
        autoCorrect={false}
        isLoading={isLoading}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />

      <View style={{ flex: 1, marginTop: "6%" }}>
        <AdvancedFlatList
          data={items}
          enabledAnimation
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
          ListHeaderComponent={
            <SearchRecentHeader
              mode={mode}
              onLocationPress={_onLocationPress}
            />
          }
          ListEmptyComponent={
            isNotFound && (
              <NotFoundPlaceholder>
                {languageContent.placeholders.no_results_for_search}
              </NotFoundPlaceholder>
            )
          }
        />
      </View>
    </FullSheetModal>
  );
};
export default SearchScreen;

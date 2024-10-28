import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import BusinessAPI from "../../backend/business";
import { FadeAnimatedView } from "../../components/animations";
import { SquareImage } from "../../components/images";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { useLanguages, useSearchFashion, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES, TAB_BAR_HEIGHT } from "../../styles/sizes";
import FullSheetModal from "../FullSheetModal";

const ICON_SIDE = ICON_SIZES.three;

const AddBusinessModal = ({ onGoBack }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const options = useRef({
    offset: 0,
    mode: "set",
  });

  const [locations, setLocations] = useState([]);

  const fetchVenues = () => {
    const { mode, offset } = options.current;

    BusinessAPI.search({ value: searchText ?? "", offset }, (data) => {
      const locations = (data ?? []).map((location) => ({
        ...location,
        text: location.name,
      }));

      if (mode == "set") {
        setLocations(locations);
      } else {
        setLocations((loc) => _.unionBy(loc, locations, "id"));
      }
    });
  };

  const { searchText, onChangeText, isLoading } = useSearchFashion({
    onChange: fetchVenues,
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const onEndReached = useCallback(() => {
    const { offset, value } = options.current;

    options.current = {
      value,
      mode: "append",
      offset: offset + 10,
    };

    fetchVenues();
  }, []);

  const onLocationPress = (location) => {
    navigation.dismissModal();

    const { id, text, type, cover_source } = location;

    onGoBack({
      id,
      value: text,
      type: "business_tag",
      source: { uri: cover_source, mediaType: "photo" },
    });
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <FadeAnimatedView>
          <BounceView
            activeScale={0.95}
            style={[theme.styles.cell, styles.cell_container]}
            onPress={() => onLocationPress(item)}
          >
            <SquareImage
              side={ICON_SIDE}
              source={icons.Cocktail}
              color={theme.colors.text}
            />

            <View style={{ marginLeft: "3%", flex: 1 }}>
              <MainText font={"subtitle"}>{item.text}</MainText>
              <MainText style={{ marginTop: 4 }} font={"subtitle"}>
                {item.city}
              </MainText>
            </View>
          </BounceView>
        </FadeAnimatedView>
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
        placeholder={languageContent.text_placeholders.search_for_venues}
      />

      <View style={styles.content}>
        <AdvancedFlatList
          showLoading
          data={locations}
          extraData={locations}
          estimatedItemSize={60}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          scrollEnabled={locations.length > 0}
          contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
        />
      </View>
    </FullSheetModal>
  );
};
export default AddBusinessModal;

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

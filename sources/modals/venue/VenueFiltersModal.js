import React, { useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { FilterButtons } from "../../components/buttons";
import { PaginatedScrollView } from "../../components/containers";
import { BusinessFeatureList } from "../../components/lists";
import { ChoicesSelector } from "../../components/selectors";
import { MoreFiltersView } from "../../components/venue";
import { useDelayedEffect, useLanguages, useStaticFeatures } from "../../hooks";
import FullSheetModal from "../FullSheetModal";

const { width } = Dimensions.get("window");
const CONTENT_WIDTH = width - 16;

const VenueFiltersModal = ({ options: initialOptions, onOptionsChanged }) => {
  const scrollRef = useRef();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const { categories, amenities } = useStaticFeatures("both");

  const [options, setOptions] = useState(initialOptions);
  const [selectedChoice, setSelectedChoice] = useState(0);

  const [loadAmenities, setLoadAmenities] = useState(false);

  useDelayedEffect(500, () => {
    setLoadAmenities(true);
  });

  const choices = useMemo(() => {
    return [
      { title: languageContent.categories },
      { title: languageContent.amenities },
    ];
  }, []);

  const areFiltersActive = useMemo(() => {
    const { filters, price_target, closed_too } = options;
    return filters.length > 0 || price_target > 0 || closed_too;
  }, [options]);

  const onMoreFiltersChanged = (newOptions) => {
    setOptions({ ...options, ...newOptions });
  };

  const onFilterSelected = (filters) => {
    setOptions({ ...options, filters, type: null });
  };

  const onDonePress = () => {
    onOptionsChanged(options);

    navigation.dismissModal();
  };

  const onCleanPress = () =>
    setOptions({
      ...options,
      filters: [],
      price_target: 0,
      closed_too: false,
      type: 0,
    });

  const onChoiceChanged = (index) => {
    scrollRef.current.scrollTo({ x: index * CONTENT_WIDTH });

    setSelectedChoice(index);
  };

  return (
    <FullSheetModal>
      <View style={styles.choicesContainer}>
        <ChoicesSelector
          selected={selectedChoice}
          onChange={onChoiceChanged}
          choices={choices}
        />
      </View>

      <View style={styles.containerList}>
        <PaginatedScrollView
          horizontal
          ref={scrollRef}
          itemSize={CONTENT_WIDTH}
          onChange={setSelectedChoice}
          style={{ marginTop: "4%", flex: 1 }}
        >
          <View style={styles.content}>
            <BusinessFeatureList
              data={categories}
              extraData={options}
              onSelected={onFilterSelected}
              selectedFeatures={options.filters}
            />
          </View>

          {loadAmenities && (
            <View style={styles.content}>
              <BusinessFeatureList
                data={amenities}
                extraData={options}
                onSelected={onFilterSelected}
                selectedFeatures={options.filters}
              />
            </View>
          )}
        </PaginatedScrollView>
      </View>

      <MoreFiltersView options={options} onChange={onMoreFiltersChanged} />

      <FilterButtons
        onDonePress={onDonePress}
        onCleanPress={onCleanPress}
        isActive={!areFiltersActive}
      />
    </FullSheetModal>
  );
};
export default VenueFiltersModal;

const styles = StyleSheet.create({
  content: {
    width: CONTENT_WIDTH,
  },
  choicesContainer: {
    alignItems: "center",
  },
  containerList: { flex: 1 },
  switchTitle: { flex: 1, marginRight: 8 },
});

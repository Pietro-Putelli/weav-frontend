import { isUndefined, pickBy, size } from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { AddCustomFeature } from "../../components/editbusiness";
import { BusinessFeatureList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useStaticFeatures } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { getEditBusiness } from "../../store/slices/businessesReducer";

const EditCategories = ({ onDataChanged, data }) => {
  const { categories } = useStaticFeatures("categories");

  const business = useSelector(getEditBusiness);

  const businessCategories = useMemo(() => {
    const category = data.category;

    if (!category) {
      return data.categories;
    }

    return [category, ...data.categories];
  }, [data]);

  const customCategories = business.extra_data?.custom_categories || [];
  const customCategoriesCount = size(customCategories);

  const { languageContent } = useLanguages();

  const onSelected = (categories) => {
    const category = categories?.[0];
    const _categories = categories.slice(1, 3);

    onDataChanged({ category, categories: _categories });
  };

  const onAddCustomPress = useCallback(() => {
    showModalNavigation({
      screen: SCREENS.CustomVenueFeature,
      passProps: { isCategories: true },
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MainText
        font="subtitle-1"
        style={{ marginBottom: "4%", marginLeft: "1%", marginRight: "4%" }}
      >
        {languageContent.add_categories_description}
      </MainText>

      <AddCustomFeature
        customCount={customCategoriesCount}
        onAddCustomPress={onAddCustomPress}
      />

      <BusinessFeatureList
        data={categories}
        maxSelections={3}
        onSelected={onSelected}
        onAddCustomPress={onAddCustomPress}
        selectedFeatures={businessCategories}
      />
    </View>
  );
};

export default memo(EditCategories);

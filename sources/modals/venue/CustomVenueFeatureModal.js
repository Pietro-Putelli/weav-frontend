import _, { cloneDeep, uniqueId } from "lodash";
import React, { useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch, useSelector } from "react-redux";
import { SolidButton } from "../../components/buttons";
import { MainTextInput } from "../../components/inputs";
import { CategoriesList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { useLanguages } from "../../hooks";
import {
  getEditBusiness,
  setEditBusiness,
} from "../../store/slices/businessesReducer";
import { icons } from "../../styles";
import { isValidText } from "../../utility/validators";
import FullSheetModal from "../FullSheetModal";

function CustomVenueFeatureModal({ isCategories }) {
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const [categoryText, setCategoryText] = useState("");

  const { extra_data: businessExtraData } = useSelector(getEditBusiness);
  const { custom_categories, custom_amenities } = businessExtraData;

  const features = isCategories ? custom_categories : custom_amenities;
  const featureKey = isCategories ? "custom_categories" : "custom_amenities";

  const navigation = useNavigation();

  const buttonEnabled = isValidText({
    text: categoryText,
    minLength: 2,
    maxLength: 24,
  });

  const setExtraData = (extraData) => {
    dispatch(
      setEditBusiness({ extra_data: { ...businessExtraData, ...extraData } })
    );
  };

  const onAddPress = () => {
    const newFeatures = cloneDeep(features);

    if (newFeatures.length > 2) {
      newFeatures.shift();
    }

    newFeatures.push({
      key: uniqueId(),
      title: categoryText,
    });

    setExtraData({ [featureKey]: newFeatures });
    setCategoryText("");
  };

  const onRemovePress = (item) => {
    setExtraData({ [featureKey]: _.without(features, item) });
  };

  return (
    <FullSheetModal>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <MainText style={{ marginHorizontal: "2%" }} font={"title-7"}>
          {isCategories
            ? languageContent.if_you_cant_find_the_category
            : languageContent.if_you_cant_find_the_amenity}
        </MainText>

        <CategoriesList data={features} onPress={onRemovePress} />

        <View>
          <MainTextInput
            solid
            autoFocus
            maxLength={24}
            value={categoryText}
            onChangeText={setCategoryText}
            placeholder={languageContent.text_placeholders.add_custom}
          />
        </View>

        <View
          style={{
            marginTop: "8%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SolidButton
            flex
            onPress={() => {
              navigation.dismissModal();
            }}
            icon={icons.Done}
            title={"done"}
            marginRight
          />
          <SolidButton
            flex
            type="done"
            disabled={!buttonEnabled}
            haptic
            onPress={onAddPress}
            icon={icons.Add}
            title={languageContent.actions.add}
          />
        </View>

        <View style={{ marginTop: "8%", marginHorizontal: "2%" }}>
          <MainText uppercase font={"subtitle-4"}>
            {languageContent.our_team_will_check_it}
          </MainText>
        </View>
      </KeyboardAwareScrollView>
    </FullSheetModal>
  );
}

export default CustomVenueFeatureModal;

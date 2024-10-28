import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useSelector } from "react-redux";
import { SolidButton } from "../components/buttons";
import { actiontypes } from "../constants";
import { useLanguages } from "../hooks";
import { getEditBusiness } from "../store/slices/businessesReducer";
import { icons, insets } from "../styles";
import {
  EditAmenities,
  EditCategories,
  EditDescription,
  EditMoreInfo,
  EditPhone,
  EditTimetable,
  EditTitle,
  ReserveOptions,
} from "./editbusiness/";
import FullSheetModal from "./FullSheetModal";

const {
  TITLE,
  CATEGORIES,
  AMENITIES,
  PHONE,
  DESCRIPTION,
  MORE_INFO,
  RESERVE_OPTIONS,
  TIMETABLE,
} = actiontypes.EDIT_BUSINESS;

const EditBusinessModal = ({ type, isEditing, changeBusiness, ...props }) => {
  const navigation = useNavigation();
  const { languageContent } = useLanguages();
  const languageContentActions = languageContent.actions;

  const business = useSelector(getEditBusiness);

  /* Temporary save data before committing to editBusiness */
  const [data, setData] = useState(business);
  const [disabled, setDisabled] = useState(false);

  const isDoneVisible =
    type == CATEGORIES || type == AMENITIES || type == TIMETABLE;

  const onDonePress = () => {
    changeBusiness({ ...data, extra_data: business.extra_data });

    navigation.dismissModal();
  };

  const actionText =
    (isEditing ? languageContentActions.edit : languageContentActions.add) +
    " ";

  const { Content, title } = useMemo(() => {
    switch (type) {
      case TITLE:
        return { Content: EditTitle, title: languageContent.name };
      case CATEGORIES:
        return { Content: EditCategories, title: languageContent.categories };
      case AMENITIES:
        return { Content: EditAmenities, title: languageContent.amenities };
      case PHONE:
        return { Content: EditPhone, title: languageContentActions.phone };
      case DESCRIPTION:
        return {
          Content: EditDescription,
          title: languageContent.description,
        };
      case RESERVE_OPTIONS:
        return {
          Content: ReserveOptions,
          title: languageContent.reserve_options,
        };
      case MORE_INFO:
        return { Content: EditMoreInfo, title: languageContent.more_info };
      case TIMETABLE:
        return { Content: EditTimetable, title: languageContent.timetable };
    }
  }, [isEditing, business]);

  return (
    <FullSheetModal title={actionText + title}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Content
          data={data}
          business={business}
          onDataChanged={setData}
          setDisabled={setDisabled}
          changeBusiness={changeBusiness}
          onDonePress={onDonePress}
          {...props}
        />
      </KeyboardAwareScrollView>

      {isDoneVisible && (
        <View style={{ marginTop: "8%", paddingBottom: insets.bottom + 16 }}>
          <SolidButton
            haptic
            type="done"
            title="done"
            icon={icons.Done}
            disabled={disabled}
            onPress={onDonePress}
          />
        </View>
      )}
    </FullSheetModal>
  );
};

export default EditBusinessModal;

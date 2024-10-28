import { size, union } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Navigation } from "react-native-navigation";
import { SolidButton } from "../../components/buttons";
import { EditBusinessStepCell, SingleTitleCell } from "../../components/cells";
import { MainScrollView } from "../../components/containers";
import { EdgeGesture } from "../../components/gestures";
import { CacheableImageView, SquareImage } from "../../components/images";
import { MainText } from "../../components/texts";
import { BounceView, PurpleDot } from "../../components/views";
import { actiontypes, imagesizes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useEditBusiness, useLanguages, useTheme } from "../../hooks";
import {
  pushNavigation,
  safePopToRoot,
  showModalNavigation,
  showStackModal,
} from "../../navigation/actions";
import { icons } from "../../styles";
import { remapUsingKey } from "../../utility/collections";
import { formatBusinessPreview, formatPhone } from "../../utility/formatters";
import { openPicker } from "../../utility/imagepicker";
import { RFPercentage } from "react-native-responsive-fontsize";

const EDIT_BUSINESS = actiontypes.EDIT_BUSINESS;

const EditBusinessScreen = ({ profileType, componentId }) => {
  const {
    business,
    isEditing,
    isLoading,
    hasChanged,
    isDoneEnbled,
    isEventProfile,
    createOrUpdate,
    changeBusiness,
  } = useEditBusiness({ profileType });

  /* Utility */

  const theme = useTheme();
  const { languageContent } = useLanguages();

  const [discardVisible, setDiscardVisible] = useState(false);

  /* Props */

  const { category, categoriesContent, amenitiesContent } = useMemo(() => {
    const { categories, amenities, extra_data } = business;

    const { custom_categories, custom_amenities } = extra_data;

    const customCategories = custom_categories || [];
    const customAmenities = custom_amenities || [];

    const _categories = union(categories, customCategories);
    const _amenities = union(amenities, customAmenities);

    const categoriesCount = size(_categories);
    const amenitiesCount = size(_amenities);

    let response = {
      category: business?.category?.title,
    };

    if (categoriesCount > 0) {
      response.categoriesContent = remapUsingKey(_categories, "title").join(
        " • "
      );
    }

    if (amenitiesCount > 0) {
      response.amenitiesContent = remapUsingKey(_amenities, "title").join(
        " • "
      );
    }

    return response;
  }, [business]);

  const businessPhone = formatPhone({ phone: business.phone });

  /* Callbacks */

  const onCoverPress = useCallback(() => {
    openPicker(imagesizes.BUSINESS_COVER_CROP, (asset) => {
      changeBusiness({ cover_source: asset });
    });
  }, []);

  const onLocationPress = useCallback(() => {
    showStackModal({
      screen: SCREENS.EditAddress,
      passProps: {
        isModal: true,
        onLocationDidChange: (location) => {
          changeBusiness({ location });
        },
      },
    });
  }, [business]);

  const onPreviewPress = useCallback(() => {
    const businessPreview = formatBusinessPreview(business);

    pushNavigation({
      componentId,
      screen: SCREENS.VenueDetail,
      passProps: { preview: businessPreview },
    });
  }, [business]);

  const onEndEditPress = useCallback(() => {
    if (hasChanged || !isEditing) {
      createOrUpdate((isDone) => {
        if (isDone) {
          if (isEditing) {
            dismiss();
          } else {
            setTimeout(() => {
              dismiss();
            }, 100);
          }
        }
      });
    }
  }, [createOrUpdate, isEditing, hasChanged]);

  const onBackGesture = useCallback(() => {
    if (hasChanged) {
      setDiscardVisible(true);
    } else {
      dismiss();
    }
  }, [hasChanged]);

  /* Methods */

  const dismiss = () => {
    Navigation.dismissAllModals();

    safePopToRoot(componentId);
  };

  const showModal = (passProps) => {
    showModalNavigation({
      screen: SCREENS.EditBusinessInfo,
      passProps,
    });
  };

  /* Props */

  const isBottomContentVisible = useMemo(() => {
    return hasChanged;
  }, [isEditing, hasChanged]);

  const coverSource = useMemo(() => {
    const coverSource = business.cover_source;

    return coverSource?.uri ?? coverSource;
  }, [business]);

  const headerProps = useMemo(() => {
    let title = languageContent.edit_business;
    if (!isEditing) {
      title = languageContent.create_business;
    }

    return {
      title,
      noBack: true,
      rightIcon: icons.Cross,
      onRightPress: () => {
        if (hasChanged) {
          setDiscardVisible(true);
        } else {
          dismiss();
        }
      },
    };
  }, [hasChanged]);

  const sharedProps = useMemo(() => {
    return {
      onPress: showModal,
      changeBusiness,
      business,
      isEventProfile,
      isEditing,
    };
  }, [business, isEditing]);

  /* Styles */

  const coverContainerStyle = useMemo(() => {
    return [theme.styles.shadow_round, styles.coverContainer];
  }, []);

  /* Components */

  const renderBottomContent = useCallback(() => {
    return (
      <View>
        <SolidButton
          type="done"
          icon={icons.Done}
          loading={isLoading}
          onPress={onEndEditPress}
          disabled={!isDoneEnbled}
          title={
            isEditing
              ? languageContent.update_business
              : languageContent.create_business
          }
        />
      </View>
    );
  }, [isEditing, isDoneEnbled, isLoading, onEndEditPress]);

  return (
    <EdgeGesture
      onBackDone={dismiss}
      onBack={onBackGesture}
      visible={discardVisible}
      setVisible={setDiscardVisible}
    >
      <MainScrollView
        isBottomContentVisible={isBottomContentVisible}
        renderBottomContent={renderBottomContent}
        {...headerProps}
      >
        <BounceView onPress={onCoverPress} style={coverContainerStyle}>
          <CacheableImageView style={styles.cover} source={coverSource} />

          <View style={styles.coverPlaceholder}>
            <SquareImage source={icons.Add} />

            <View style={styles.row}>
              <MainText
                align="center"
                style={styles.coverPlaceholderTitle}
                font="subtitle"
              >
                {languageContent.tap_to_add_cove_picture}
              </MainText>
            </View>
          </View>
        </BounceView>

        <EditBusinessStepCell
          title={languageContent.name}
          isRequired
          content={business?.name}
          type={EDIT_BUSINESS.TITLE}
          {...sharedProps}
        />

        {!isEventProfile && (
          <EditBusinessStepCell
            title={languageContent.location}
            placeholder={languageContent.add_location}
            icon={icons.ColoredMarker}
            isRequired={!isEventProfile}
            content={business?.location?.address}
            {...sharedProps}
            onPress={onLocationPress}
          />
        )}

        {!isEventProfile && (
          <>
            <EditBusinessStepCell
              title={languageContent.categories}
              content={categoriesContent}
              isRequired={!isEventProfile}
              type={EDIT_BUSINESS.CATEGORIES}
              category={category}
              {...sharedProps}
            />

            <EditBusinessStepCell
              isOptional
              title={languageContent.amenities}
              content={amenitiesContent}
              type={EDIT_BUSINESS.AMENITIES}
              {...sharedProps}
            />
          </>
        )}

        <EditBusinessStepCell
          isOptional
          isNumbers
          icon={icons.ColoredPhone}
          type={EDIT_BUSINESS.PHONE}
          title={languageContent.phone}
          content={businessPhone}
          {...sharedProps}
        />

        <EditBusinessStepCell
          isOptional
          multilineContent
          title={languageContent.description}
          content={business?.description}
          type={EDIT_BUSINESS.DESCRIPTION}
          {...sharedProps}
        />

        <EditBusinessStepCell
          isOptional
          content={languageContent.more_info}
          icon={icons.ColoredLink}
          type={EDIT_BUSINESS.MORE_INFO}
          {...sharedProps}
        />

        {!isEventProfile && (
          <EditBusinessStepCell
            isOptional
            content={languageContent.timetable}
            icon={icons.ColoredClock}
            isRequired={!isEventProfile}
            type={EDIT_BUSINESS.TIMETABLE}
            {...sharedProps}
          />
        )}

        <View style={styles.noteContainer}>
          <PurpleDot style={{ marginRight: 8 }} />

          <MainText bold uppercase font="subtitle-4">
            {languageContent.these_fields_are_required}
          </MainText>
        </View>

        <SingleTitleCell
          icon={icons.EyeShow}
          onPress={onPreviewPress}
          disabled={!isDoneEnbled}
          title={languageContent.see_preview}
        />
      </MainScrollView>
    </EdgeGesture>
  );
};

export default EditBusinessScreen;

const BUSINESS_COVER_SIZE = imagesizes.BUSINESS_COVER;

const styles = StyleSheet.create({
  coverContainer: {
    marginBottom: "4%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    width: BUSINESS_COVER_SIZE.width - 16,
    height: RFPercentage(40),
  },
  cover: {
    ...StyleSheet.absoluteFill,
    zIndex: 5,
    elevation: 0,
  },
  coverPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  noteContainer: {
    marginTop: "4%",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: "2%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "8%",
    marginTop: "4%",
  },
  coverPlaceholderTitle: { flex: 1 },
});

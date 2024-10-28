import { size } from "lodash";
import React, { memo, useCallback } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { AddCustomFeature } from "../../components/editbusiness";
import { BusinessFeatureList } from "../../components/lists";
import { SCREENS } from "../../constants/screens";
import { useStaticFeatures } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { getEditBusiness } from "../../store/slices/businessesReducer";

const EditAmenities = ({ onDataChanged, data }) => {
  const { amenities } = useStaticFeatures("amenities");

  const business = useSelector(getEditBusiness);

  const customAmenities = business.extra_data?.custom_amenities || [];
  const customAmenitiesCount = size(customAmenities);

  const onSelected = (amenities) => {
    onDataChanged({ amenities });
  };

  const onAddCustomPress = useCallback(() => {
    showModalNavigation({ screen: SCREENS.CustomVenueFeature });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AddCustomFeature
        customCount={customAmenitiesCount}
        onAddCustomPress={onAddCustomPress}
      />

      <BusinessFeatureList
        data={amenities}
        onSelected={onSelected}
        onAddCustomPress={onAddCustomPress}
        selectedFeatures={data.amenities}
      />
    </View>
  );
};

export default memo(EditAmenities);

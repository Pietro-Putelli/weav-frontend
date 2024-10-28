import { cloneDeep, findIndex } from "lodash";
import React, { memo, useCallback } from "react";
import { View } from "react-native";
import MultiSelectableIconList from "./MultiSelectableIconList";

const BusinessFeatureList = ({
  onSelected,
  selectedFeatures,
  maxSelections,
  data,
  ...props
}) => {
  /* Callbacks */

  const onFeaturePress = useCallback(
    (feature) => {
      const featureId = feature.id;

      let newFeatures = cloneDeep(selectedFeatures);
      const index = findIndex(selectedFeatures, ["id", featureId]);

      if (index != -1) {
        newFeatures = newFeatures.filter((feature) => {
          return feature.id != featureId;
        });
      } else {
        newFeatures.push(feature);
      }

      if (newFeatures.length > maxSelections) {
        newFeatures.shift();
      }

      onSelected(newFeatures);
    },
    [selectedFeatures, maxSelections, onSelected]
  );

  return (
    <View style={{ flex: 1 }}>
      <MultiSelectableIconList
        data={data}
        onSelected={onFeaturePress}
        selectedItems={selectedFeatures}
        {...props}
      />
    </View>
  );
};

export default memo(BusinessFeatureList);

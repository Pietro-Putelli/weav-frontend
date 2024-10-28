import React from "react";
import { Text, View } from "react-native";
import { PlaceInfoView } from "../../components/venue";
import { useTheme } from "../../hooks";
import FullSheetModal from "../FullSheetModal";

const VenueMapModal = ({ venue }) => {
  const theme = useTheme();

  const coordinate = venue.location.coordinate;

  return (
    <FullSheetModal cursor fullScreen contentStyle={{ paddingTop: "2%" }}>
      <PlaceInfoView venue={venue} />

      <View style={{ alignItems: "center", marginTop: "6%" }}>
        <Text style={{ fontFamily: "Verdana", color: theme.colors.text }}>
          {`${coordinate?.latitude.toFixed(
            4
          )} • ${coordinate?.longitude.toFixed(4)}`}
        </Text>
      </View>
    </FullSheetModal>
  );
};

export default VenueMapModal;

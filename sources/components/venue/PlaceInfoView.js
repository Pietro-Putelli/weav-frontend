import React, { useRef } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SolidButton } from "../buttons";
import { LeftIconTitleCell } from "../cells";
import { SquareImage } from "../images";
import { CustomMarker, MapView } from "../map";
import { MainText } from "../texts";

const { height } = Dimensions.get("window");
const ICON_SIDE = ICON_SIZES.two;

const isAndroid = Platform.OS === "android";
const MAP_HEIGHT = isAndroid ? height / 1.8 : height / 2;

const PlaceInfoView = ({ venue }) => {
  const coordinate = venue.location.coordinate;

  const mapRef = useRef();
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const onGetDirectionPress = () => {
    showSheetNavigation({
      screen: SCREENS.MapSelector,
      passProps: {
        coordinate: venue.location.coordinate,
        address: venue.address,
        name: venue.name,
      },
    });
  };

  return (
    <View>
      <View style={[styles.addressContainer, theme.styles.shadow_round]}>
        <SquareImage
          coloredIcon
          side={ICON_SIDE}
          source={icons.ColoredMarker}
        />
        <MainText font="subtitle-1" style={{ flex: 1, marginHorizontal: "3%" }}>
          {venue.location.address}
        </MainText>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          showUserLocation
          cameraProps={{ coordinate, zoomLevel: 17.8 }}
          onPress={onGetDirectionPress}
          style={StyleSheet.absoluteFillObject}
        >
          <CustomMarker coordinate={coordinate} />
        </MapView>
      </View>

      <View style={{ marginTop: "4%" }}>
        {venue?.nearby_info != null && (
          <LeftIconTitleCell
            noSegue
            coloredIcon
            item={{ title: venue.nearby_info, icon: icons.Near }}
          />
        )}
        <SolidButton
          type="done"
          icon={icons.Directions}
          onPress={onGetDirectionPress}
          title={languageContent.buttons.get_directions}
          style={{ marginTop: venue.nearby_info == null ? "4%" : 0 }}
        />
      </View>
    </View>
  );
};
export default PlaceInfoView;

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: "6%",
    borderRadius: 8,
    overflow: "hidden",
    height: MAP_HEIGHT,
  },
  container: {
    marginTop: "4%",
    flexDirection: "row",
  },
  addressContainer: {
    paddingHorizontal: "4%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: "4%",
  },
});

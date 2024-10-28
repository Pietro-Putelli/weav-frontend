import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { FadeAnimatedView } from "../../components/animations";
import { SquareImage } from "../../components/images";
import { CustomMarker, MapView } from "../../components/map";
import { MainText } from "../../components/texts";
import { BounceView, EdgeBackGestureView } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import { useTheme } from "../../hooks";
import { showSheetNavigation } from "../../navigation/actions";
import { icons, insets } from "../../styles";
import { widthPercentage } from "../../styles/sizes";

const BACK_SIDE = widthPercentage(0.11);

const MapScreen = ({ place }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const { name, coordinate } = place;

  const onBackPress = () => {
    navigation.pop();
  };

  const onDirectionPress = () => {
    showSheetNavigation({
      screen: SCREENS.MapSelector,
      passProps: {
        coordinate,
        name,
      },
    });
  };

  return (
    <FadeAnimatedView mode="fade" style={{ flex: 1 }}>
      <EdgeBackGestureView />
      <View style={styles.header_container}>
        <BounceView
          onPress={onBackPress}
          style={[styles.back_container, theme.styles.shadow]}
        >
          <SquareImage side={BACK_SIDE * 0.4} source={icons.Chevrons.Left} />
        </BounceView>

        <View style={[theme.styles.shadow_round, styles.header_title]}>
          <MainText font={"subtitle"} numberOfLines={2}>
            {name}
          </MainText>
        </View>

        <BounceView
          onPress={onDirectionPress}
          style={[styles.back_container, theme.styles.shadow]}
        >
          <SquareImage side={BACK_SIDE * 0.5} source={icons.Directions} />
        </BounceView>
      </View>

      <MapView
        showUserLocation
        style={StyleSheet.absoluteFillObject}
        cameraProps={{ coordinate, zoomLevel: 16 }}
      >
        <CustomMarker
          key={"location"}
          coordinate={coordinate}
          color={theme.colors.main_accent}
        />
      </MapView>
    </FadeAnimatedView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  header_container: {
    flexDirection: "row",
    marginHorizontal: "4%",
    top: insets.top,
    zIndex: 10,
    position: "absolute",
    alignItems: "center",
  },
  header_title: {
    flex: 1,
    padding: "2%",
    marginHorizontal: "2%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: BACK_SIDE,
  },
  back_container: {
    width: BACK_SIDE,
    height: BACK_SIDE,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom_container: {
    alignItems: "center",
    paddingTop: "3%",
    width: "100%",
    bottom: 0,
    zIndex: 4,
    position: "absolute",
    paddingBottom: insets.bottom,
  },
  direction_button: {
    width: "80%",
    marginTop: "4%",
  },
});

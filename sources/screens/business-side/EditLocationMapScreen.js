import React, { useMemo, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { IconButton, SolidButton } from "../../components/buttons";
import { CustomMarker, MapView } from "../../components/map";
import { MainText } from "../../components/texts";
import { EdgeBackGestureView } from "../../components/views";
import { useLanguages, useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { triggerHapticOnce } from "../../utility/haptics";

const EditLocationMapScreen = ({ location, onLocationDidChange }) => {
  const [coordinate, setCoordinate] = useState(location.coordinate);

  const theme = useTheme();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const onMapPress = ({ coordinate }) => {
    triggerHapticOnce();

    setCoordinate(coordinate);
  };

  const bottomContainerStyle = useMemo(() => {
    return [styles.bottomContainer];
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <EdgeBackGestureView />

      <View style={styles.header}>
        <IconButton
          onPress={() => {
            navigation.pop();
          }}
          inset={2}
          solid
          source={icons.Chevrons.Left}
        />

        <View
          style={[
            theme.styles.shadow_round,
            { padding: 8, paddingHorizontal: 16, marginLeft: 8, flex: 1 },
          ]}
        >
          <MainText font="subtitle-2" align="center">
            {languageContent.tap_to_change_marker_position}
          </MainText>
        </View>
      </View>

      <MapView
        onPress={onMapPress}
        initialRegion={coordinate}
        style={StyleSheet.absoluteFillObject}
      >
        <CustomMarker
          coordinate={coordinate}
          color={theme.colors.main_accent}
        />
      </MapView>

      <View style={bottomContainerStyle}>
        <SolidButton
          onPress={() => {
            onLocationDidChange({ ...location, coordinate });
            navigation.dismissModal();
          }}
          type="done"
          title="done"
          icon={icons.Done}
        />
      </View>
    </View>
  );
};

export default EditLocationMapScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    zIndex: 2,
    position: "absolute",
    marginTop: insets.top,
    marginHorizontal: "2%",
    flexDirection: "row",
    alignItems: "center",
  },
  bottomContainer: {
    bottom: 0,
    width: "100%",
    paddingTop: "4%",
    position: "absolute",
    paddingHorizontal: "2%",
    paddingBottom: insets.bottom + 4,
  },
});

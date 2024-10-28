import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { MainScrollView } from "../../components/containers";
import { EdgeGesture } from "../../components/gestures";
import { SolidSearchBar } from "../../components/inputs";
import { AdvancedFlatList } from "../../components/lists";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useSearchFashion, useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { geoCode, reverseGeoCode } from "../../utility/geolocation";
import { triggerHapticOnce } from "../../utility/haptics";
import FullSheetModal from "../FullSheetModal";

const EditAddressModal = ({
  venue,
  onLocationDidChange,
  isModal,
  componentId,
  ...props
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const [locations, setLocations] = useState([]);

  const onChangeLocation = () => {
    geoCode(
      {
        value: searchText,
        types: ["place", "address", "locality", "postcode", "neighborhood"],
      },
      (locations) => {
        setLocations(locations);
      }
    );
  };

  const { isLoading, setIsLoading, onChangeText, searchText } =
    useSearchFashion({
      onChange: onChangeLocation,
    });

  const dismiss = () => {
    navigation.dismissModal();
    triggerHapticOnce();
  };

  const onLocationPress = ({ place_name, coordinate }) => {
    setIsLoading(true);

    reverseGeoCode(coordinate, ({ text, id }) => {
      const location = {
        address: place_name,
        coordinate,
        city: text,
        place_id: id,
      };

      setIsLoading(false);

      if (!isModal) {
        onLocationDidChange(location);
        dismiss();
      } else {
        pushNavigation({
          componentId,
          screen: SCREENS.EditLocationMap,
          passProps: { location, onLocationDidChange },
        });
      }
    });
  };

  const renderItem = useCallback(
    ({ item }) => (
      <BounceView
        haptic
        style={[theme.styles.cell, { marginVertical: "1%" }]}
        onPress={() => onLocationPress(item)}
      >
        <MainText font="subtitle"> {item.place_name} </MainText>
      </BounceView>
    ),
    [onLocationPress]
  );

  const Container = useMemo(() => {
    if (isModal) {
      return MainScrollView;
    }
    return FullSheetModal;
  }, []);

  return (
    <Container
      title={languageContent.header_titles.edit_location}
      modal
      {...props}
    >
      <EdgeGesture disabled={!isModal}>
        <SolidSearchBar
          autoFocus
          value={searchText}
          isLoading={isLoading}
          placeholder={languageContent.text_placeholders.search_for_address}
          onChangeText={onChangeText}
        />
        <View style={{ marginTop: "4%", flex: 1 }}>
          <AdvancedFlatList
            data={locations}
            enabledAnimation
            estimatedItemSize={100}
            renderItem={renderItem}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
          />
        </View>
      </EdgeGesture>
    </Container>
  );
};

export default EditAddressModal;

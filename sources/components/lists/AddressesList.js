import { useKeyboard } from "@react-native-community/hooks";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { geoCode } from "../../utility/geolocation";
import { LeftIconButton } from "../buttons";
import { MainText } from "../texts";
import { BounceView } from "../views";
import AdvancedFlatList from "./AdvancedFlatList";

const AddressesList = ({ address, onMyLocationPress, onPress }) => {
  const keyboardHeight = useKeyboard().keyboardHeight;
  const [addresses, setAddresses] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    if (address == "") {
      setAddresses([]);
      return;
    }

    geoCode(
      {
        value: address,
        types: ["place", "address", "locality", "postcode", "neighborhood"],
      },
      (locations) => {
        setAddresses(locations);
      }
    );
  }, [address]);

  const renderItem = ({ item }) => (
    <BounceView
      haptic
      style={[theme.styles.cell, { marginVertical: "1%" }]}
      onPress={() => onPress(item)}
    >
      <MainText font="subtitle"> {item.place_name} </MainText>
    </BounceView>
  );

  const keyExtractor = (item) => item.id.toString();

  return (
    <View style={{ marginTop: "4%", flex: 1 }}>
      <AdvancedFlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <View style={{ marginVertical: "2%" }}>
            <LeftIconButton
              icon={icons.Marker1}
              onPress={onMyLocationPress}
              title={"use my current position"}
            />
          </View>
        }
        scrollIndicatorInsets={{ bottom: keyboardHeight * 0.9 }}
        contentContainerStyle={{
          paddingBottom: keyboardHeight + 16,
        }}
      />
    </View>
  );
};
export default AddressesList;

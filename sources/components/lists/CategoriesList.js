import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { IconButton } from "../buttons";
import { MainText } from "../texts";
import { FadeAnimatedView } from "../animations";

const { height } = Dimensions.get("window");

const CategoriesList = ({ data, style, onPress }) => {
  const theme = useTheme();

  const renderItem = useCallback(
    ({ item }) => (
      <FadeAnimatedView style={[styles.cell, theme.styles.shadow_round]}>
        <MainText numberOfLines={1} bold font="subtitle" style={styles.title}>
          {" "}
          {item?.title}{" "}
        </MainText>
        <IconButton
          side="three"
          source={icons.Cross}
          onPress={() => onPress(item)}
        />
      </FadeAnimatedView>
    ),
    [data, onPress]
  );

  const keyExtractor = (_, index) => index.toString();

  return (
    <View style={[styles.container, style]}>
      <FlatList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={data}
        scrollEnabled={false}
      />
    </View>
  );
};
export default CategoriesList;

const styles = StyleSheet.create({
  container: {
    marginVertical: "4%",
  },
  cell: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "4%",
    marginVertical: "1%",
  },
  title: {
    flex: 1,
    marginRight: "4%",
  },
});

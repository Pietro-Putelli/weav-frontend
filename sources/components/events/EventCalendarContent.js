import React, { memo, useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { FadeAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { AdvancedFlatList } from "../lists";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import ShortEventCell from "./ShortEventCell";

const { width } = Dimensions.get("window");
const CALENDAR_SIDE = width / 7;

const EventCalendarContent = ({ onEventPress, event }) => {
  const { items } = event;

  const { languageContent } = useLanguages();

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <ShortEventCell index={index} onPress={onEventPress} event={item} />
      );
    },
    [onEventPress]
  );

  return (
    <View style={styles.container}>
      <SeparatorTitle>{languageContent.planned_events}</SeparatorTitle>

      <AdvancedFlatList
        data={items}
        estimatedItemSize={60}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

export default memo(EventCalendarContent);

const ListEmptyComponent = () => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView style={styles.placeholder}>
      <SquareImage
        coloredIcon
        side={CALENDAR_SIDE}
        source={icons.ColoredCalendar}
      />
      <MainText align="center" font="subtitle" style={styles.title}>
        {languageContent.placeholders.no_planned_events}
      </MainText>
    </FadeAnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    padding: 12,
  },
  placeholder: {
    flex: 1,
    marginTop: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: "4%",
    marginHorizontal: "12%",
  },
});

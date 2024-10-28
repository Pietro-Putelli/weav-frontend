import React, { memo, useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useLanguages, useTheme } from "../../hooks";
import { HorizontalCarousel } from "../lists";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");

const VenueHighlights = ({ highlights, onPress }) => {
  const theme = useTheme();
  const scrollX = useSharedValue(0);
  const { languageContent } = useLanguages();

  const renderItem = useCallback(({ item }) => {
    return (
      <BounceView
        onPress={() => onPress(true)}
        style={[styles.cellContainer, theme.styles.shadow_round]}
      >
        <MainText bold font="title-7">
          {item.title}
        </MainText>
        <MainText font="subtitle-3" style={{ marginTop: 8 }}>
          {item.content}
        </MainText>
      </BounceView>
    );
  }, []);

  return (
    <>
      <SeparatorTitle style={{ marginLeft: 0 }} marginTop>
        {languageContent.highlights}
      </SeparatorTitle>

      <View style={styles.carouselContainer}>
        <HorizontalCarousel
          data={highlights}
          scrollX={scrollX}
          itemWidth={width - 12}
          sliderWidth={width - 24}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        />
      </View>
    </>
  );
};

export default memo(VenueHighlights);

const styles = StyleSheet.create({
  cellContainer: {
    padding: 16,
    width: width - 24,
  },
  button: {
    marginTop: "4%",
  },
  carouselContainer: {
    width: width - 24,
  },
});

import React, { memo, useMemo, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { CheckmarkButton } from "../buttons";
import { SquareImage } from "../images";
import { PriceSelector } from "../selectors";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import { BounceView } from "../views";

const CELL_HEIGHT = Math.round(RFPercentage(7));

const ITEMS = [{ type: "price" }, { type: "closed_too" }];

const MoreFiltersView = ({ options, onChange }) => {
  const theme = useTheme();
  const listRef = useRef();

  const { languageContent } = useLanguages();

  const { price_target, closed_too } = options;

  const scrollToAlign = (index) => {
    listRef.current?.scrollToIndex({
      index,
      viewPosition: 0.5,
      animated: true,
    });
  };

  const cellStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.cell,
    };
  }, []);

  const renderItem = ({ item, index }) => {
    const { type } = item;

    if (type == "closed_too") {
      return (
        <BounceView
          onPress={() => {
            scrollToAlign(index);
            onChange({ closed_too: !closed_too });
          }}
          style={cellStyle}
        >
          <SquareImage
            side={ICON_SIZES.two}
            source={icons.Closed}
            coloredIcon
          />
          <MainText style={{ marginLeft: 12 }} bold font="subtitle-3" uppercase>
            {languageContent.show_closed_venues}
          </MainText>
          <View style={styles.checkmark}>
            <CheckmarkButton hideUnselected selected={closed_too} />
          </View>
        </BounceView>
      );
    }

    return (
      <View style={[cellStyle, { marginRight: 8 }]}>
        <PriceSelector
          price={price_target}
          onChange={(value) => {
            scrollToAlign(index);
            onChange({ price_target: value });
          }}
        />
      </View>
    );
  };

  const keyExtractor = (item) => {
    return item.type;
  };

  return (
    <View style={styles.container}>
      <SeparatorTitle>More filters</SeparatorTitle>

      <FlatList
        horizontal
        data={ITEMS}
        ref={listRef}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default memo(MoreFiltersView);

const styles = StyleSheet.create({
  container: {
    marginTop: "4%",
    marginHorizontal: "1%",
  },
  cell: {
    height: CELL_HEIGHT,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  checkmark: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
});

import { FlashList } from "@shopify/flash-list";
import React, { memo, useCallback, useMemo } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { MEDIA_DOMAIN } from "../../backend/endpoints";
import { useTheme } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { CheckmarkButton } from "../buttons";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");

const CATEGORY_CELL_SIDE = (width - 16 - 6 * 5) / 4;
const ICON_SIDE = CATEGORY_CELL_SIDE * 0.32;

const MultiSelectableIconList = ({
  data,
  onSelected,
  selectedItems,
  numberOfLines,
  disableCellAnimation,
  ...props
}) => {
  const theme = useTheme();

  const selectedItemIds = useMemo(() => {
    return selectedItems.map((item) => {
      return item.id;
    });
  }, [selectedItems]);

  const titleStyle = useMemo(() => {
    return {
      bold: true,
      uppercase: true,
      align: "center",
      numberOfLines: 2,
      font: "subtitle",
      style: {
        marginTop: "16%",
        marginHorizontal: "2%",
        fontSize: RFValue(9),
        fontWeight: "bold",
      },
    };
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedItemIds.includes(item.id);

      const icon = `${MEDIA_DOMAIN}/utils/icons/${item.icon}.png`;

      return (
        <FadeAnimatedView disabled={disableCellAnimation}>
          <BounceView
            style={[styles.categoryCell, theme.styles.shadow_round]}
            onPress={() => onSelected(item)}
          >
            <Image source={{ uri: icon }} style={styles.icon} />
            <MainText {...titleStyle}>{item.title}</MainText>
          </BounceView>

          <View style={styles.checkmark}>
            <CheckmarkButton hideUnselected selected={isSelected} />
          </View>
        </FadeAnimatedView>
      );
    },
    [selectedItemIds, onSelected]
  );

  let style;
  if (numberOfLines) {
    style = { height: numberOfLines * (CATEGORY_CELL_SIDE + 12) };
  }

  return (
    <View style={[style, { flex: numberOfLines ? 0 : 1 }]}>
      <FlashList
        data={data}
        numColumns={4}
        extraData={selectedItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={CATEGORY_CELL_SIDE}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        keyboardDismissMode="on-drag"
        {...props}
      />
    </View>
  );
};
export default memo(MultiSelectableIconList);

const styles = StyleSheet.create({
  categoryCell: {
    marginHorizontal: 5,
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    width: CATEGORY_CELL_SIDE,
    height: CATEGORY_CELL_SIDE,
  },
  icon: { width: ICON_SIDE, height: ICON_SIDE, resizeMode: "contain" },
  checkmark: {
    position: "absolute",
    bottom: 6,
    right: 6,
  },
});

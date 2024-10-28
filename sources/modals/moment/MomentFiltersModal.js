import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { FilterButtons } from "../../components/buttons";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { useTheme } from "../../hooks";
import FullSheetModal from "../FullSheetModal";

const TITLES = ["Today", "Tomorrow", "This week"];

const { width } = Dimensions.get("window");
const CELL_WIDTH = (width - 40) / 3;

const MomentFiltersModal = () => {
  const theme = useTheme();

  /* Callbacks */

  const onDonePress = useCallback(() => {}, []);

  const onCleanPress = useCallback(() => {}, []);

  return (
    <FullSheetModal>
      <SeparatorTitle>select period</SeparatorTitle>

      <View style={styles.filters_container}>
        {TITLES.map((title, index) => {
          return (
            <BounceView
              haptic
              style={[theme.styles.shadow_round, styles.cell_container]}
              key={index}
            >
              <MainText uppercase font="subtitle-1" bold>
                {title}
              </MainText>
            </BounceView>
          );
        })}
      </View>

      <SeparatorTitle marginTop>choose category</SeparatorTitle>
      <View style={{ flex: 1 }}></View>

      <FilterButtons
        isActive={false}
        onDonePress={onDonePress}
        onCleanPress={onCleanPress}
      />
    </FullSheetModal>
  );
};

export default MomentFiltersModal;

const styles = StyleSheet.create({
  filters_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  cell_container: {
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
    width: CELL_WIDTH,
  },
});

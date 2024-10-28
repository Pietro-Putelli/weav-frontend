import React, { useCallback, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { SolidButton } from "../../components/buttons";
import { MainScrollView } from "../../components/containers";
import { CacheableImageView } from "../../components/images";
import { DraggableGridView } from "../../components/lists";
import { PostCell } from "../../components/posts";
import { SeparatorTitle } from "../../components/separators";
import { useLanguages } from "../../hooks";

const { width } = Dimensions.get("window");

const PADDING = 4;
const CELL_WIDTH = (width - 8) / 4;
const CELL_HEIGHT = CELL_WIDTH * 1.5;

const SortPostSliceScreen = ({ slices, onSlicesSorted }) => {
  const navigation = useNavigation();
  const [_slices, setSlices] = useState(slices);
  const { languageContent } = useLanguages();

  const onReleaseCell = useCallback((slices) => {
    setSlices(slices);
  }, []);

  const onDonePress = () => {
    onSlicesSorted?.(_slices);
    navigation.pop();
  };

  const keyExtractor = useCallback(
    (item, index) => item?.id?.toString() || index,
    []
  );

  const renderItem = useCallback((post) => {
    return (
      <View style={styles.cell_container}>
        <PostCell hideOverlay disabled post={post} style={styles.cell} />
      </View>
    );
  }, []);

  const renderBottomContent = useCallback(
    () => <SolidButton title="done" type="done" onPress={onDonePress} />,
    [_slices]
  );

  return (
    <MainScrollView
      style={{ flex: 1 }}
      title={languageContent.header_titles.reorder_slices}
      renderBottomContent={renderBottomContent}
      scrollEnabled={false}
      contentStyle={{
        paddingTop: 0,
        paddingHorizontal: 4,
      }}
    >
      <SeparatorTitle>
        {languageContent.separator_titles.hold_and_drag}
      </SeparatorTitle>

      <View style={{ flex: 1, marginTop: "2%" }}>
        {_slices.length > 0 && (
          <DraggableGridView
            cellSize={{
              width: CELL_WIDTH,
              height: CELL_HEIGHT,
            }}
            contentContainerStyle={{ justifyContents: "center" }}
            data={_slices}
            numColumns={4}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onReleaseCell={onReleaseCell}
          />
        )}
      </View>
    </MainScrollView>
  );
};
export default SortPostSliceScreen;

const styles = StyleSheet.create({
  cell_container: {
    justifyContent: "center",
    alignItems: "center",
    padding: PADDING,
  },
  cell: {
    width: CELL_WIDTH - PADDING,
    height: CELL_HEIGHT - PADDING,
    borderRadius: 4,
  },
});

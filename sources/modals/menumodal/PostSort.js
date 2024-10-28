import React, { memo, useMemo, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { CheckableCell } from "../../components/cells";
import { useLanguages } from "../../hooks";

const PostSort = ({ ordering, onFilterSet, setVisible }) => {
  const [selectedFilter, setSelectedFilter] = useState(ordering);

  const { languageContent } = useLanguages();

  const filters = useMemo(() => {
    return [
      { title: languageContent.most_recent, type: "newer" },
      { title: languageContent.less_recent, type: "older" },
    ];
  }, []);

  const renderItem = ({ item }) => {
    const onPress = () => {
      setSelectedFilter(item.type);
      onFilterSet(item.type);

      setTimeout(() => {
        setVisible(false);
      }, 200);
    };

    return (
      <CheckableCell
        item={item}
        onPress={onPress}
        selected={selectedFilter == item.type}
        style={{ marginVertical: "3%", marginTop: 0 }}
      />
    );
  };

  const keyExtractor = (item) => item.title;

  return (
    <View>
      <FlatList
        data={filters}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};
export default memo(PostSort);

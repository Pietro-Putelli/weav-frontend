import React, { memo, useCallback, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { insets } from "../../styles";
import { ChoicesSelector } from "../selectors";

const { width } = Dimensions.get("window");

const TabListView = ({ onChoiceChange, choices }) => {
  /* States */
  const [index, setIndex] = useState(0);

  /* Utility */

  const scrollRef = useRef();

  /* Callbacks */

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }) => {
      const scrollIndex = Math.max(0, Math.floor(x / width));

      if (scrollIndex !== index) {
        setIndex(scrollIndex);

        onChoiceChange?.(scrollIndex);
      }
    },
    [index]
  );

  const onIndexChanged = useCallback(
    (index) => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: index * width });
      }
    },
    [scrollRef]
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        pagingEnabled
        bounces={false}
        ref={scrollRef}
        style={{ width }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
      >
        {choices.map(({ title, component }) => {
          return (
            <View key={title} style={styles.container}>
              {component}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.selector}>
        <ChoicesSelector
          selected={index}
          choices={choices}
          onChange={onIndexChanged}
        />
      </View>
    </View>
  );
};

export default memo(TabListView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  selector: {
    alignSelf: "center",
    position: "absolute",
    bottom: insets.bottom + 8,
  },
});

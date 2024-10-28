import { cloneDeep } from "lodash";
import React, { memo, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { isAndroidDevice } from "../../utility/functions";
import { HorizontalCarousel } from "../lists";
import SocialShareItem from "./SocialShareItem";
import { SOCIAL_CELL_SIDE } from "./constants";
import shareItems from "./shareItems";

const { width } = Dimensions.get("window");
const PADDING = Math.round(width / 2) - Math.round(SOCIAL_CELL_SIDE / 2);

const isAndroid = isAndroidDevice();

const SocialShareCarousel = ({
  disabled,
  disableReport,
  contentContainerStyle,
  onPress,
}) => {
  const scrollX = useSharedValue(0);

  const data = useMemo(() => {
    const _shareItems = cloneDeep(shareItems);

    if (isAndroid) {
      return _shareItems.splice(1, 5);
    }

    if (disableReport) {
      return _shareItems.slice(0, 4);
    }

    return _shareItems.slice(0, 5);
  }, []);

  const renderItem = (props) => {
    const isLast = props.index === data.length - 1;

    return (
      <SocialShareItem
        disabled={disabled}
        {...props}
        isLast={isLast}
        onPress={onPress}
        scrollX={scrollX}
      />
    );
  };

  return (
    <HorizontalCarousel
      horizontal
      hapticEnabled
      data={data}
      scrollX={scrollX}
      renderItem={renderItem}
      itemWidth={SOCIAL_CELL_SIDE}
      keyExtractor={(item) => item.title}
      contentContainerStyle={{
        ...styles.contentContainerStyle,
        ...contentContainerStyle,
      }}
    />
  );
};

export default memo(SocialShareCarousel);

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: PADDING,
  },
});

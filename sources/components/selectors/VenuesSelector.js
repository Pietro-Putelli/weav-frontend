import React, { forwardRef, memo, useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES, VENUE_TYPES_SELECTOR_HEIGHT } from "../../styles/sizes";
import { AnimatedBackgroundColorView, ScaleAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { AdvancedFlatList } from "../lists";
import { MainText } from "../texts";
import { BounceView } from "../views";
import mergeRefs from "../../utility/mergeRefs";

const CELL_HEIGHT = VENUE_TYPES_SELECTOR_HEIGHT - 16;

const VenuesSelector = forwardRef(
  ({ selected, onChange, hasFilters, isVisible }, ref) => {
    const listRef = useRef();
    const theme = useTheme();

    const { languageContent } = useLanguages();

    const venueTypes = useMemo(() => {
      if (hasFilters) {
        return [
          {
            id: -1,
            title: languageContent.buttons.clear_filter,
            icon: icons.Cross,
          },
        ];
      }

      return languageContent.venue_types.map((venueType) => {
        return {
          ...venueType,
          icon: icons.VenueTypes[venueType.id],
        };
      });
    }, [hasFilters]);

    const onPress = ({ id, index }) => {
      listRef.current?.scrollToIndex({
        index,
        viewPosition: 0.5,
        animated: true,
      });

      onChange(id);
    };

    const translateY = useDerivedValue(() => {
      return withTiming(isVisible ? 0 : -VENUE_TYPES_SELECTOR_HEIGHT, {
        damping: 16,
      });
    }, [isVisible]);

    /* Styles */

    const containerAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
        backgroundColor: theme.colors.background,
      };
    });

    /* Components */

    const renderItem = useCallback(
      ({ item, index }) => {
        const isSelected = selected === item.id;

        return (
          <VenueTypeCell
            index={index}
            onPress={onPress}
            isSelected={isSelected}
            {...item}
          />
        );
      },
      [onPress, hasFilters, selected]
    );

    return (
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <AdvancedFlatList
          horizontal
          ref={mergeRefs([listRef, ref])}
          data={venueTypes}
          extraData={selected}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.list}
        />
      </Animated.View>
    );
  }
);

export default memo(VenuesSelector);

const VenueTypeCell = ({ title, id, isSelected, icon, index, onPress }) => {
  const theme = useTheme();

  return (
    <ScaleAnimatedView>
      <BounceView haptic onPress={() => onPress({ id, index })}>
        <AnimatedBackgroundColorView
          style={styles.cell}
          isActive={isSelected}
          // colors={[theme.colors.background, theme.colors.second_background]}
          colors={[theme.colors.second_background, theme.colors.main_accent]}
        >
          <SquareImage source={icon} side={ICON_SIZES.two * 0.9} />
          <MainText bold style={{ marginLeft: 8 }} font="subtitle-3" uppercase>
            {title}
          </MainText>
        </AnimatedBackgroundColorView>
      </BounceView>
    </ScaleAnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 4,
    paddingBottom: 12,
    position: "absolute",
    zIndex: 10,
  },
  list: {
    height: CELL_HEIGHT,
  },
  cell: {
    marginHorizontal: 4,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    height: CELL_HEIGHT,
    paddingHorizontal: 16,
  },
  contentContainerStyle: {
    paddingHorizontal: 6,
  },
});

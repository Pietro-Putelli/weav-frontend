import _ from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { pushNavigation } from "../../navigation/actions";
import { isNullOrUndefined } from "../../utility/boolean";
import TagItem from "./TagItem";

const TagsList = ({
  moment,
  style,
  isEditing,
  flexWrap,
  onRemovePress,
  componentId,
}) => {
  const { url_tag, location_tag } = moment;

  const onPress = useCallback((tag) => {
    const type = tag.type;

    let screen;
    let passProps = {};

    if (type == "url_tag") {
      screen = SCREENS.Web;
      passProps = { url: tag.value };
    } else if (type == "location_tag") {
      screen = SCREENS.Map;
      passProps = {
        place: {
          name: tag.value,
          coordinate: tag.coordinate,
        },
      };
    }

    pushNavigation({
      componentId,
      screen,
      passProps,
    });
  }, []);

  const tags = useMemo(() => {
    let tags = [location_tag, url_tag].filter((tag) => {
      return !isNullOrUndefined(tag);
    });

    return tags;
  }, [moment]);

  const multipleLines = isEditing || flexWrap;

  const contentContainerStyle = useMemo(() => {
    let newStyle = {};

    if (multipleLines) {
      newStyle = {
        justifyContent: "flex-start",
        flexWrap: "wrap",
        flex: 1,
        ...style,
      };
    }

    return newStyle;
  }, []);

  if (_.isEmpty(tags) && !isEditing) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!isEditing || flexWrap}
        contentContainerStyle={contentContainerStyle}
      >
        {tags.map((tag, index) => {
          return (
            <TagItem
              tag={tag}
              key={index}
              isEditing={isEditing}
              onPress={() => onPress(tag)}
              onRemovePress={onRemovePress}
              style={{ marginTop: multipleLines ? 8 : 0 }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(TagsList);

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
});

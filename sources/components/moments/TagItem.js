import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { BORDER_RADIUS, ICON_SIZES } from "../../styles/sizes";
import { getHostnameFromRegex } from "../../utility/functions";
import { ScaleAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const ICONS = {
  bar: icons.Cocktail,
  experience: icons.Explore,
  url: icons.Link,
  club: icons.Chat,
  shop: icons.Shop,
  restaurant: icons.Restaurant,
  location: icons.Marker1,
};

const ICON_SIDE = ICON_SIZES.three;

const TagItem = ({ tag, isEditing, style, onRemovePress, onPress }) => {
  const { type, value, name } = tag;

  const theme = useTheme();

  const textContent = useMemo(() => {
    if (type == "url_tag" || type == "url") {
      return getHostnameFromRegex(value);
    }
    return value ?? name;
  }, [tag]);

  const containerStyle = useMemo(() => {
    return {
      ...style,
      ...styles.container,
      backgroundColor: theme.colors.main_accent,
    };
  }, [isEditing]);

  return (
    <ScaleAnimatedView disabled={!isEditing}>
      <BounceView
        onPress={onPress}
        style={containerStyle}
        disabledWithoutOpacity={isEditing}
      >
        <SquareImage
          side={ICON_SIDE}
          source={ICONS[type?.replace("_tag", "")] ?? icons.Cocktail}
        />

        <MainText style={{ marginLeft: 8 }} bold font="subtitle-1" uppercase>
          {textContent}
        </MainText>

        {isEditing && (
          <IconButton
            haptic
            side="five"
            source={icons.Cross}
            style={styles.cross_button}
            onPress={() => onRemovePress(tag)}
          />
        )}
      </BounceView>
    </ScaleAnimatedView>
  );
};

export default memo(TagItem);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 10,
    borderRadius: BORDER_RADIUS / 2,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  cross_button: {
    marginLeft: 8,
  },
});

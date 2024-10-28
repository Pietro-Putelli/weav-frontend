import { isUndefined } from "lodash";
import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES, PROFILE_IMAGE_SIDE } from "../../styles/sizes";
import { CheckmarkButton } from "../buttons";
import { ProfilePicture, SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const HorizontalUserProfileCell = ({ user, onPress, selected }) => {
  const theme = useTheme();

  const isSelectionCell = !isUndefined(selected);

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.container,
    };
  }, []);

  return (
    <BounceView onPress={() => onPress(user)} style={containerStyle}>
      <ProfilePicture
        disabled
        removeOutline
        source={user.picture}
        side={PROFILE_IMAGE_SIDE}
      />

      <MainText
        font="subtitle"
        style={{ flex: 1, bottom: 1.5, marginHorizontal: "3%" }}
      >
        {user.username}
      </MainText>

      {isSelectionCell && <CheckmarkButton selected={selected} />}

      {!isSelectionCell && (
        <SquareImage
          source={icons.Chevrons.Right}
          side={ICON_SIZES.chevron_right}
          color={theme.colors.placeholderText}
        />
      )}
    </BounceView>
  );
};

export default memo(HorizontalUserProfileCell);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "3%",
    paddingVertical: "2.5%",
    marginBottom: "3%",
  },
});

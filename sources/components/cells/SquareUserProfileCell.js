import { isUndefined } from "lodash";
import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { PROFILE_IMAGE_SIDE } from "../../styles/sizes";
import { CheckmarkButton } from "../buttons";
import { ProfilePicture } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const SquareUserProfileCell = ({
  side,
  user,
  myUserId,
  index,
  onPress,
  selected,
}) => {
  const theme = useTheme();

  const isSelectionCell = !isUndefined(selected);

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.container,
      width: side,
      height: side,
      marginHorizontal: 3,
    };
  }, [index]);

  const amI = myUserId === user.id;

  const username = useMemo(() => {
    if (amI) {
      return "You";
    }

    return user.username;
  }, [amI]);

  return (
    <BounceView
      disabledWithoutOpacity={amI}
      onPress={() => onPress(user)}
      style={containerStyle}
    >
      <ProfilePicture
        disabled
        removeOutline
        source={user.picture}
        side={PROFILE_IMAGE_SIDE}
      />

      <MainText
        align="center"
        font="subtitle-3"
        numberOfLines={1}
        style={styles.title}
      >
        {username}
      </MainText>

      {isSelectionCell && <CheckmarkButton selected={selected} />}
    </BounceView>
  );
};

export default memo(SquareUserProfileCell);

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 8,
    marginHorizontal: 12,
  },
});

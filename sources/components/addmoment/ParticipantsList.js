import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AdvancedFlatList } from "../lists";
import { MainText } from "../texts";
import { FadeAnimatedView, ScaleAnimatedView } from "../animations";
import { BounceView } from "../views";
import { ProfilePicture } from "../images";
import { Hairline, SeparatorTitle } from "../separators";
import { isEmpty } from "lodash";
import { IconButton } from "../buttons";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";

const { width } = Dimensions.get("window");

const CELL_SIDE = (width - 16 - 8 * 4) / 5;

const ParticipantsList = ({ users, onRemoveUserPress }) => {
  const renderItem = useCallback(
    ({ item: user }) => {
      return (
        <ScaleAnimatedView style={styles.cell}>
          <IconButton
            blur
            haptic
            source={icons.Cross}
            side={ICON_SIZES.six}
            style={styles.cancelButton}
            onPress={() => {
              onRemoveUserPress(user);
            }}
          />

          <ProfilePicture
            disabled
            removeOutline
            side={CELL_SIDE * 0.6}
            source={user.picture}
          />
          <MainText
            font="subtitle-4"
            numberOfLines={1}
            style={{ marginTop: 6 }}
            align="center"
          >
            {user.username}
          </MainText>
        </ScaleAnimatedView>
      );
    },
    [onRemoveUserPress]
  );

  if (isEmpty(users)) {
    return null;
  }

  return (
    <FadeAnimatedView style={styles.container}>
      <SeparatorTitle style={{ marginLeft: "3%" }}>participants</SeparatorTitle>

      <AdvancedFlatList
        horizontal
        data={users}
        style={styles.list}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
      />

      <Hairline width={0.96} />
    </FadeAnimatedView>
  );
};

export default ParticipantsList;

const styles = StyleSheet.create({
  container: {
    marginTop: "3%",
  },
  list: {
    height: CELL_SIDE,
  },
  cell: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    top: 0,
    right: 0,
    zIndex: 2,
    position: "absolute",
  },
  contentContainerStyle: {
    paddingHorizontal: 8,
  },
});

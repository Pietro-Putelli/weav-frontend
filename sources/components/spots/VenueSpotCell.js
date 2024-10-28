import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";
import { CELL_IMAGE_SIDE, CELL_SIDE } from "./constants";

const VenueSpotCell = ({ venue, index, onPress }) => {
  return (
    <BounceView
      haptic
      onPress={() => onPress({ venue, index })}
      style={styles.container}
    >
      <CacheableImageView source={venue?.cover_source} style={styles.image} />

      <MainText
        bold
        align="center"
        font="subtitle-3"
        numberOfLines={2}
        style={styles.title}
      >
        {venue.name}
      </MainText>
    </BounceView>
  );
};

export default memo(VenueSpotCell);

const styles = StyleSheet.create({
  container: {
    width: CELL_SIDE,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: CELL_IMAGE_SIDE,
    height: CELL_IMAGE_SIDE,
    borderRadius: CELL_IMAGE_SIDE / 2.2,
  },
  title: {
    marginTop: 10,
  },
});

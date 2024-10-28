import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { useCurrentBusiness } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { BounceView } from "../views";
import ProfilePicture from "./ProfilePicture";
import SquareImage from "./SquareImage";

const MOMENT_CIRCLE_SIDE = widthPercentage(0.3);

const BusinessProfilePicture = ({ onPress, onAddPress }) => {
  const { business, momentDoesNotExist } = useCurrentBusiness();

  return (
    <BounceView
      onPress={() => {
        if (momentDoesNotExist) {
          onAddPress();
        } else {
          onPress();
        }
      }}
    >
      {momentDoesNotExist && (
        <FadeAnimatedView mode="fade" style={styles.placeholder}>
          <SquareImage source={icons.Add} color="white" />
        </FadeAnimatedView>
      )}

      <ProfilePicture
        disabled
        side={MOMENT_CIRCLE_SIDE}
        source={business?.cover_source}
        hasOutline={!momentDoesNotExist}
      />
    </BounceView>
  );
};

export default memo(BusinessProfilePicture);

const styles = StyleSheet.create({
  placeholder: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    ...StyleSheet.absoluteFillObject,
    borderRadius: MOMENT_CIRCLE_SIDE / 2.2,
  },
});

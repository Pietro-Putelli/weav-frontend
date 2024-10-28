import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { gradients } from "../../styles";
import { MomentCellPreviewSize } from "../../styles/sizes";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const BusinessMessage = ({ message, componentId }) => {
  const profile = message?.business_profile;
  const theme = useTheme();

  const onPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.VenueDetail,
      passProps: { initialBusiness: profile },
    });
  };

  return (
    <BounceView
      onPress={onPress}
      style={[
        {
          borderRadius: 16,
          overflow: "hidden",
          width: MomentCellPreviewSize.mediaWidth,
          height: MomentCellPreviewSize.maxHeight / 2,
        },
        theme.styles.shadow_round_second,
      ]}
    >
      <LinearGradient
        end={{ x: 0, y: 0 }}
        start={{ x: 0, y: 1 }}
        style={styles.overlay}
        colors={gradients.Shadow}
      >
        <MainText bold numberOfLines={2} font={"title-5"}>
          {profile.name}
        </MainText>
      </LinearGradient>

      <CacheableImageView
        source={profile.cover_source}
        style={StyleSheet.absoluteFillObject}
      />
    </BounceView>
  );
};

export default memo(BusinessMessage);

const styles = StyleSheet.create({
  overlay: {
    zIndex: 2,
    bottom: -1,
    padding: "3%",
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
});

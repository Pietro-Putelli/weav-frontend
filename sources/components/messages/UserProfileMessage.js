import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { widthPercentage } from "../../styles/sizes";
import { ProfilePicture } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const USER_PROFILE_IMG_SIDE = widthPercentage(0.11);

const UserProfileMessage = ({ isSender, message, componentId }) => {
  const theme = useTheme();
  const { user_profile } = message;

  const onPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: { user: user_profile },
    });
  };

  const contentStyle = useMemo(
    () => ({
      ...theme.styles.shadow_round,
      backgroundColor: isSender
        ? theme.colors.third_background
        : theme.colors.second_background,
      borderRadius: 16,
      padding: 12,
    }),
    []
  );

  return (
    <BounceView
      onPress={onPress}
      style={[
        theme.styles.shadow_round_second,
        styles.user_profile_container,
        contentStyle,
      ]}
    >
      <ProfilePicture
        disabled
        side={USER_PROFILE_IMG_SIDE}
        source={user_profile.picture}
      />
      <MainText bold font={"subtitle-1"} style={styles.profile_title}>
        @{user_profile.username}
      </MainText>
    </BounceView>
  );
};

export default memo(UserProfileMessage);

const styles = StyleSheet.create({
  user_profile_container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  profile_title: {
    marginLeft: 8,
  },
});

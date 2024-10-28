import React, { memo, useMemo } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { FadeAnimatedView } from "../animations";
import { ProfilePicture } from "../images";
import { MainText } from "../texts";
import { BounceView, FadeView } from "../views";

const { width } = Dimensions.get("window");

const CELL_SIDE = (width - 20) / 4;
const IMAGE_SIDE = CELL_SIDE / 2;

const UserSelectableCell = ({ user, selected, onPress }) => {
  const theme = useTheme();

  const contentStyle = useMemo(() => {
    return {
      ...styles.content,
      ...theme.styles.shadow_round,
    };
  }, []);

  return (
    <FadeAnimatedView mode="fade">
      <BounceView haptic style={styles.container} onPress={() => onPress(user)}>
        <View style={contentStyle}>
          <View style={styles.image}>
            <FadeView style={styles.overlay} hidden={!selected}>
              <Image
                style={{
                  ...styles.check_icon,
                  tintColor: theme.colors.main_accent,
                }}
                source={icons.Selected}
              />
            </FadeView>
            <ProfilePicture side={IMAGE_SIDE} source={user.picture} />
          </View>

          <MainText font={"subtitle-4"} style={styles.title} numberOfLines={1}>
            {user?.name || user?.username}
          </MainText>
        </View>
      </BounceView>
    </FadeAnimatedView>
  );
};

export default memo(UserSelectableCell);

const styles = StyleSheet.create({
  container: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "90%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  check_icon: {
    width: "60%",
    height: "60%",
  },
  image: {
    width: IMAGE_SIDE,
    height: IMAGE_SIDE,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderRadius: IMAGE_SIDE / 2.2,
  },
  title: {
    marginTop: "3%",
    marginHorizontal: 8,
  },
});

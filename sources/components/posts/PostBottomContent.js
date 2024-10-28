import { BlurView } from "expo-blur";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { BORDER_RADIUS, ICON_SIZES } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { MainText } from "../texts";

const ICON_SIDE = ICON_SIZES.two * 0.9;

const PostBottomContent = ({ slice, title }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={[theme.styles.shadow_round, styles.container]}>
      <MainText font="title-5">{slice.title}</MainText>
    </View>
  );
};

export default memo(PostBottomContent);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    position: "absolute",
    zIndex: 2,
    bottom: 0,
    width: "100.5%",
    alignSelf: "center",
    borderRadius: 20,
    paddingBottom: insets.bottomAndroid + 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttons_content: {
    flex: 1,
    marginLeft: 16,
    borderRadius: BORDER_RADIUS * 1.2,
    overflow: "hidden",
  },
  username_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    marginTop: "1%",
    marginLeft: "1%",
  },
});

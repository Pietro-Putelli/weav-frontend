import { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { BORDER_RADIUS, BUTTON_HEIGHT, ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const LoginWithButton = ({ type = "apple", style, onPress }) => {
  const { loginLanguageContent } = useLanguages();

  const { icon, title } = useMemo(() => {
    let icon = icons.Apple;
    let title = "Apple";

    if (type == "google") {
      icon = icons.Google;
      title = "Google";
    }

    return { icon, title };
  }, [type, loginLanguageContent]);

  return (
    <BounceView
      activeScale={0.94}
      onPress={() => onPress(type)}
      style={[styles.container, style]}
    >
      <SquareImage
        color="black"
        source={icon}
        side={ICON_SIZES.two}
        coloredIcon={type == "google"}
        inset={type == "google" ? 2 : 0}
      />
      <MainText
        style={{ marginLeft: "4%", marginTop: type == "apple" ? 2 : 0 }}
        bold
        color={"black"}
        font="subtitle-2"
        uppercase
      >
        {title}
      </MainText>
    </BounceView>
  );
};

export default memo(LoginWithButton);

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: BORDER_RADIUS * 1.2,
  },
});

import { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { MainText } from "../texts";
import { LoaderView } from "../views";

const { width, height } = Dimensions.get("window");

const LoginWithLoader = ({ visible }) => {
  const theme = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <FadeAnimatedView style={styles.container}>
      <View style={[styles.content, theme.styles.shadow_round_second]}>
        <LoaderView />
        <MainText style={{ marginTop: "4%" }} font="subtitle">
          Logging in...
        </MainText>
      </View>
    </FadeAnimatedView>
  );
};

export default memo(LoginWithLoader);

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: "4%",
    alignItems: "center",
    minWidth: "50%",
  },
  button: {
    marginTop: "4%",
    height: 30,
  },
});

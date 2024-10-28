import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { MainText } from "../../components/texts";
import { useTheme } from "../../hooks";
import { BORDER_RADIUS, BUTTON_HEIGHT } from "../../styles/sizes";
import PopupModal from "./PopupModal";

const { width } = Dimensions.get("window");
const PADDING = width / 12;

const SinglePopupModal = ({ title, onDonePress, setVisible, ...props }) => {
  const theme = useTheme();

  const _onDonePress = () => {
    setTimeout(() => {
      setVisible?.(false);
    }, 100);

    onDonePress?.();
  };

  return (
    <PopupModal disabledGesture setVisible={setVisible} {...props}>
      <View style={[theme.styles.shadow_round, styles.container]}>
        <MainText bold font="subtitle-1" uppercase align="center">
          {title}
        </MainText>

        <SolidButton
          type="done"
          title="OK"
          onPress={_onDonePress}
          style={styles.button}
        />
      </View>
    </PopupModal>
  );
};

export default memo(SinglePopupModal);

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    alignItems: "center",
    marginHorizontal: 16,
    paddingVertical: PADDING / 1.5,
    borderRadius: BORDER_RADIUS * 1.5,
  },
  button: {
    height: BUTTON_HEIGHT * 0.9,
    width: "80%",
    marginTop: "8%",
  },
});

import React, { memo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { MainText } from "../../components/texts";
import { useLanguages, useTheme } from "../../hooks";
import { BORDER_RADIUS, BUTTON_HEIGHT } from "../../styles/sizes";
import PopupModal from "./PopupModal";

const { width } = Dimensions.get("window");
const PADDING = width / 12;

const DoubleOptionPopupModal = ({
  visible,
  setVisible,
  title,
  doneType = "done",
  doneTitle,
  onDonePress,
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const onCancelPress = () => setVisible?.(false);

  const _onDonePress = () => {
    setTimeout(() => {
      setVisible?.(false);
    }, 100);

    onDonePress?.();
  };

  return (
    <PopupModal {...{ visible, setVisible }}>
      <View style={[theme.styles.shadow_round, styles.container]}>
        <MainText bold font="subtitle-1" uppercase align="center">
          {title}
        </MainText>
        <View style={styles.buttonsContainer}>
          <SolidButton
            hairline
            title={languageContent.actions.cancel}
            style={styles.button}
            onPress={onCancelPress}
          />
          <SolidButton
            title={doneType == "done" ? "OK" : doneTitle ?? "delete"}
            type={doneType}
            onPress={_onDonePress}
            style={styles.button}
            loadingOnPress
          />
        </View>
      </View>
    </PopupModal>
  );
};
export default memo(DoubleOptionPopupModal);

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    alignItems: "center",
    marginHorizontal: 16,
    paddingVertical: PADDING / 1.5,
    borderRadius: BORDER_RADIUS * 1.5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: PADDING / 1.5,
  },
  button: {
    width: width / 2.8,
    height: BUTTON_HEIGHT * 0.9,
    marginHorizontal: PADDING / 3,
  },
});

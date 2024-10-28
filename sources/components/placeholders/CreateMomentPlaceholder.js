import { MotiView } from "moti";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import { FadeAnimatedView } from "../../components/animations";
import { useLanguages, useTheme, useUser } from "../../hooks";
import { setTutorial } from "../../store/slices/settingsReducer";
import { icons } from "../../styles";
import { triggerHapticOnce } from "../../utility/haptics";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";

const { width } = Dimensions.get("window");

const DELAY = 400;

const CreateMomentPlaceholder = ({ type, onPress }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();
  const placeholder = languageContent.create_moment_placeholder;

  const { city } = useUser();

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      triggerHapticOnce();
    }, DELAY * 4);
  }, []);

  return (
    <FadeAnimatedView style={styles.container}>
      <MainText
        align="center"
        bold
        font="title-6"
        style={{ marginBottom: "4%", marginHorizontal: "4%" }}
      >
        {placeholder.title1} {city} {placeholder.title2}
      </MainText>

      {placeholder.items.map((item, index) => {
        return (
          <MotiView
            key={index}
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 14, delay: index * DELAY }}
            style={[theme.styles.shadow_round, styles.cell]}
          >
            <MainText align="center" font="subtitle-1">
              {item}
            </MainText>
          </MotiView>
        );
      })}

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: DELAY * 4 }}
        style={{ marginTop: "4%" }}
      >
        <SolidButton
          type="done"
          activeScale={0.98}
          title={placeholder.buttonTitle}
          onPress={() => {
            dispatch(setTutorial({ createMoment: true }));

            onPress();
          }}
        />
      </MotiView>
    </FadeAnimatedView>
  );
};

export default CreateMomentPlaceholder;

const styles = StyleSheet.create({
  container: {
    width,
    height: RFPercentage(85),
    justifyContent: "center",
    paddingHorizontal: "4%",
  },
  cell: {
    marginVertical: 8,
    padding: 16,
  },
});

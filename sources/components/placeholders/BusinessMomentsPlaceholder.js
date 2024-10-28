import { MotiView } from "moti";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useLanguages, useTheme } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";

const { width } = Dimensions.get("window");
const DELAY = 400;

const BusinessMomentsPlaceholder = ({ onPress, business }) => {
  const { languageContent } = useLanguages();

  const placeholders = languageContent.business_moments_placeholders;

  const theme = useTheme();

  return (
    <FadeAnimatedView style={styles.container}>
      <MainText
        align="center"
        bold
        font="title-6"
        style={{ marginBottom: "4%", marginHorizontal: "2%" }}
      >
        {languageContent.see_whats_happening_at} {business.name}
      </MainText>

      <View>
        {placeholders.map((item, index) => {
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
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: DELAY * 2 }}
        style={{ marginTop: "4%" }}
      >
        <SolidButton onPress={onPress} type="done" title="catch the moment" />
      </MotiView>
    </FadeAnimatedView>
  );
};

export default BusinessMomentsPlaceholder;

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

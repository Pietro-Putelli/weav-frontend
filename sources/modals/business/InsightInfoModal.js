import React, { memo } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SolidButton } from "../../components/buttons";
import { SquareImage } from "../../components/images";
import { Separator } from "../../components/separators";
import { MainText } from "../../components/texts";
import { useLanguages, useTheme } from "../../hooks";
import { icons, insets } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { contactSupportTeam } from "../../utility/shareApis";
import FullSheetModal from "../FullSheetModal";

const SIDE = widthPercentage(0.2);

const InsightInfoModal = () => {
  const theme = useTheme();
  const { languageContent } = useLanguages();
  const insightsContent = languageContent.insights_description;

  return (
    <FullSheetModal
      title={insightsContent.about}
      contentStyle={{ marginHorizontal: "1%" }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <View style={{ alignItems: "center", marginBottom: "4%" }}>
          <SquareImage coloredIcon side={SIDE} source={icons.ColoredChart} />
        </View>

        <MainText font="subtitle-2">
          {insightsContent.about_description}
        </MainText>

        <Separator />

        <Section title="rank">{insightsContent.rank_description}</Section>

        <Separator />

        <Section title="reposts">{insightsContent.reposts_description}</Section>

        <Separator />

        <Section title={insightsContent.shares_title}>
          {insightsContent.shares_description}
        </Section>
        <Separator />

        <SolidButton
          type="done"
          onPress={contactSupportTeam}
          style={{ marginTop: "6%" }}
          title={languageContent.buttons.contact_us}
        />
      </ScrollView>
    </FullSheetModal>
  );
};

export default InsightInfoModal;

const Section = memo(({ title, children }) => {
  const theme = useTheme();

  return (
    <View>
      <MainText bold font="title-7" capitalize>
        {title}
      </MainText>

      <MainText
        style={{ marginTop: "2%", marginHorizontal: "1%" }}
        font="subtitle-1"
        color={theme.white_alpha(0.6)}
      >
        {children}
      </MainText>
    </View>
  );
});

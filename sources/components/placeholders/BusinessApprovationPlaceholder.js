import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useBusinessPosts, useLanguages, useTheme } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";

const BusinessApprovationPlaceholder = ({ onChangeTab }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { postsCount } = useBusinessPosts({});

  return (
    <>
      <SeparatorTitle marginTop noBottom>
        {languageContent.separator_titles.status}
      </SeparatorTitle>

      <FadeAnimatedView style={[theme.styles.shadow, styles.container]}>
        <MainText bold font="title-6" align="center">
          {languageContent.welcome_to_the_app}
        </MainText>

        <View style={{ marginTop: "2%" }}>
          <MainText align="center" font="subtitle-2">
            {languageContent.placeholders.business_approvation}
          </MainText>
        </View>

        {postsCount < 4 && (
          <View style={{ marginTop: "6%" }}>
            <SolidButton
              onPress={() => {
                showStackModal({
                  screen: SCREENS.EditBusinessPost,
                  fullscreen: true,
                  passProps: {
                    onEndEditing: () => {
                      onChangeTab(1);
                    },
                  },
                });
              }}
              icon={icons.Add}
              title={languageContent.buttons.create_post}
              type="done"
            />
          </View>
        )}
      </FadeAnimatedView>
    </>
  );
};

export default memo(BusinessApprovationPlaceholder);

const styles = StyleSheet.create({
  container: {
    padding: "5%",
    marginTop: "4%",
  },
});

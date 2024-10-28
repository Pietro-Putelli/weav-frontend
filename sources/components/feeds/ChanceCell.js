import React, { memo, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { ignoreUserChance } from "../../backend/chances";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import { DoubleOptionPopupModal } from "../../modals";
import { pushNavigation } from "../../navigation/actions";
import { BUTTON_HEIGHT, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { ProfilePicture } from "../images";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import { BounceView } from "../views";

const PROFILE_PICTURE_SIDE = widthPercentage(0.12);

const ChanceCell = ({ chance, componentId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const [visible, setVisible] = useState(false);

  /* Props */

  const containerStyle = useMemo(() => {
    return [styles.container, theme.styles.shadow_round];
  }, []);

  /* Callbacks */

  const onIgnorePress = () => {
    dispatch(ignoreUserChance(chance.id));
  };

  const onChancePress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.Profile,
      passProps: {
        user: chance.user,
      },
    });
  };

  return (
    <>
      <FadeAnimatedView>
        <SeparatorTitle marginLeft>
          {languageContent.today_chance}
        </SeparatorTitle>

        <BounceView onPress={onChancePress} style={containerStyle}>
          <View style={styles.content}>
            <ProfilePicture
              side={PROFILE_PICTURE_SIDE}
              source={chance.user.picture}
            />

            <MainText style={styles.username} bold font="title-8">
              {chance.user.username}
            </MainText>

            <SolidButton
              title="ignore"
              style={[
                styles.ignoreButton,
                { backgroundColor: theme.colors.background },
              ]}
              onPress={() => {
                setVisible(true);
              }}
            />
          </View>
        </BounceView>
      </FadeAnimatedView>

      <DoubleOptionPopupModal
        visible={visible}
        setVisible={setVisible}
        onDonePress={onIgnorePress}
        title={languageContent.popup_contents.ignore_chance}
      />
    </>
  );
};

export default memo(ChanceCell);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "2%",
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    marginBottom: "4%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    flex: 1,
    marginLeft: "4%",
    marginRight: "4%",
  },
  ignoreButton: {
    height: BUTTON_HEIGHT * 0.8,
  },
});

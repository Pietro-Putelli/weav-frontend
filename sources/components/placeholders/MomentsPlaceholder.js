import React, { memo, useMemo } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { SCREENS } from "../../constants/screens";
import { useLanguages } from "../../hooks";
import { pushNavigation, showStackModal } from "../../navigation/actions";
import { icons, images } from "../../styles";
import { PLACEHOLDER_HEIGHT, widthPercentage } from "../../styles/sizes";
import { FadeAnimatedView } from "../animations";
import { SolidButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";

const { width, height } = Dimensions.get("window");

const ICON_SIDE = widthPercentage(0.3);
const IMAGE_WIDTH = widthPercentage(0.65);

const MomentsPlaceholder = ({ isEvent, componentId }) => {
  const { languageContent } = useLanguages();

  const { icon, content, buttonTitle, buttonIcon } = useMemo(() => {
    if (isEvent) {
      return {
        icon: icons.ColoredEvent,
        content: languageContent.placeholders.event_moments,
        buttonTitle: languageContent.buttons.show_venues,
        buttonIcon: icons.VenueTypes[0],
      };
    }

    return {
      icon: images.People,
      content: "",
      buttonTitle: "",
      content: languageContent.placeholders.user_moments,
      buttonTitle: languageContent.buttons.create_moment,
      buttonIcon: icons.Add,
    };
  }, [isEvent, languageContent]);

  return (
    <FadeAnimatedView style={[styles.container]}>
      <View style={styles.content}>
        {isEvent ? (
          <SquareImage
            coloredIcon
            source={icon}
            side={ICON_SIDE}
            style={styles.icon}
          />
        ) : (
          <Image
            source={icon}
            style={{
              width: IMAGE_WIDTH,
              height: IMAGE_WIDTH * 0.85,
            }}
          />
        )}

        <MainText bold align="center" font="subtitle">
          {content}
        </MainText>

        <SolidButton
          type="done"
          icon={buttonIcon}
          title={buttonTitle}
          style={styles.button}
          onPress={() => {
            if (isEvent) {
              // onChangeTab(2);
              pushNavigation({
                componentId,
                screen: SCREENS.BusinessList,
              });
            } else {
              showStackModal({ screen: SCREENS.CreateMoment });
            }
          }}
        />
      </View>
    </FadeAnimatedView>
  );
};

export default memo(MomentsPlaceholder);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width,
    height,
  },
  content: {
    width: "75%",
    alignItems: "center",
  },
  icon: {
    marginBottom: "8%",
  },
  button: {
    width: "80%",
    marginTop: "6%",
  },
});

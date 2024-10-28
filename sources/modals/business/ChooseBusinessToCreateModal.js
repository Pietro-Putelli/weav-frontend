import React, { useCallback, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SquareImage } from "../../components/images";
import { HorizontalCarousel } from "../../components/lists";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import { showStackModal } from "../../navigation/actions";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import ModalScreen from "../ModalScreen";

const { width } = Dimensions.get("window");

const CELL_SIDE = widthPercentage(0.7);

const CELL_CONTENT_SIDE = CELL_SIDE * 0.5;
const IMAGE_SIDE = CELL_CONTENT_SIDE * 0.5;
const PADDING = Math.round(width / 2) - Math.round(CELL_SIDE / 2);

const ChooseBusinessToCreateModal = ({ componentId }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const choices = useMemo(() => {
    const typeIcons = [icons.ColoredBar, icons.ColoredEvent];
    const typeIds = ["venue", "event"];

    /*
      TEMPORARY DISABLED EVENT ORGANIZER PROFILE
    */

    return languageContent.create_business_choices
      .map((item, index) => {
        return {
          ...item,
          icon: typeIcons[index],
          type: typeIds[index],
        };
      })
      .slice(0, 1);
  }, []);

  const onTypePress = (type) => {
    showStackModal({
      componentId,
      screen: SCREENS.EditBusiness,
      passProps: {
        profileType: type,
      },
    });
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <View style={styles.cellContainer}>
        <BounceView
          onPress={() => onTypePress(item.type)}
          style={[theme.styles.shadow_round, styles.cellContent]}
        >
          <SquareImage source={item.icon} side={IMAGE_SIDE} coloredIcon />
        </BounceView>

        <View style={styles.textContent}>
          <MainText align="center" font="title-7" bold>
            {item.title}
          </MainText>

          <MainText align="center" font="subtitle-2" style={{ marginTop: 8 }}>
            {item.description}
          </MainText>
        </View>
      </View>
    );
  }, []);

  return (
    <ModalScreen
      contentStyle={styles.contentStyle}
      title={languageContent.create_your_business}
      cursor
    >
      <View style={styles.subtitleContainer}>
        <MainText font="subtitle-2">
          {languageContent.choose_your_profile_type}
        </MainText>
      </View>

      <View>
        <HorizontalCarousel
          horizontal
          hapticEnabled
          data={choices}
          itemWidth={CELL_SIDE}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </View>
    </ModalScreen>
  );
};

export default ChooseBusinessToCreateModal;

const styles = StyleSheet.create({
  cellContainer: {
    width: CELL_SIDE,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cellContent: {
    width: CELL_CONTENT_SIDE,
    height: CELL_CONTENT_SIDE,
    borderRadius: CELL_CONTENT_SIDE / 2.3,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: "4%",
    marginHorizontal: "4%",
  },
  contentContainerStyle: {
    paddingHorizontal: PADDING,
  },
  contentStyle: {
    paddingHorizontal: 0,
    paddingBottom: "2%",
  },
  textContent: { marginTop: 16, alignItems: "center" },
  subtitleContainer: {
    marginHorizontal: "5%",
    marginTop: -8,
    marginBottom: "6%",
  },
});

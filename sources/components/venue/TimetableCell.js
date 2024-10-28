import React from "react";
import { showSheetNavigation } from "../../navigation/actions";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import { isBusinessOpen } from "../../dates/timetable";
import { BounceView } from "../views";
import { SquareImage } from "../images";
import { ICON_SIZES } from "../../styles/sizes";
import { icons } from "../../styles";
import { View } from "react-native";
import { MainText } from "../texts";

const TimetableCell = ({ timetable }) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  const { isOpen, content } = isBusinessOpen(timetable);

  const title = isOpen ? languageContent.open : languageContent.closed;
  const color = isOpen ? theme.colors.green : theme.colors.red;

  const onPress = () => {
    showSheetNavigation({
      screen: SCREENS.VenueTimetable,
      passProps: { timetable, isOpen },
    });
  };

  return (
    <BounceView
      style={[
        {
          padding: 14,
          marginTop: 4,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: "4%",
        },
        theme.styles.shadow_round,
      ]}
      onPress={onPress}
    >
      <SquareImage
        coloredIcon
        side={ICON_SIZES.one * 0.9}
        source={icons.ColoredClock}
      />

      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <MainText
          numberOfLines={1}
          style={{ marginLeft: 12, width: "25%" }}
          bold
          uppercase
          color={color}
          font="subtitle-2"
        >
          {title}
        </MainText>
        <MainText
          numberOfLines={2}
          style={{ flex: 1, marginRight: 8 }}
          font="subtitle-2"
        >
          {content}
        </MainText>
      </View>

      <SquareImage
        side={ICON_SIZES.chevron_right}
        color={theme.white_alpha(0.3)}
        source={icons.Chevrons.Right}
      />
    </BounceView>
  );
};

export default TimetableCell;

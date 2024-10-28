import moment from "moment";
import React, { memo, useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const ShortEventCell = ({ onPress, event, index }) => {
  const theme = useTheme();

  const { title, time } = event;

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      padding: "4%",
      marginTop: index > 0 ? "3%" : 0,
      flexDirection: "row",
      alignItems: "center",
    };
  }, [index]);

  return (
    <BounceView
      onPress={() => {
        onPress(event);
      }}
      style={containerStyle}
    >
      <View style={{ flex: 1 }}>
        <MainText font="title-8">{title}</MainText>
      </View>

      <MainText style={{ marginHorizontal: 8 }} font="subtitle">
        {moment(time, "HH:mm:ss").format("hh:mm")}
      </MainText>

      <SquareImage
        source={icons.Chevrons.Right}
        side={ICON_SIZES.chevron_right}
        color={theme.colors.placeholderText}
      />
    </BounceView>
  );
};

export default memo(ShortEventCell);

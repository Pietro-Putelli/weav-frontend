import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";
import { actionCellContainerStyle, ICON_SIDE } from "./styles";

const EventDetailActionCell = ({
  index,
  title,
  action,
  icon,
  onPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        marginRight: 16,
        alignItems: "center",
        ...style,
      }}
    >
      <BounceView
        activeScale={0.9}
        onPress={() => onPress(action)}
        style={[
          theme.styles.shadow,
          actionCellContainerStyle,
          {
            backgroundColor:
              index == 0
                ? theme.colors.main_accent
                : theme.colors.second_background,
          },
        ]}
      >
        <SquareImage source={icon} side={ICON_SIDE} />
      </BounceView>
      <MainText
        font="subtitle-5"
        align="center"
        uppercase
        style={styles.subtitle}
      >
        {title}
      </MainText>
    </View>
  );
};

export default memo(EventDetailActionCell);

const styles = StyleSheet.create({
  subtitle: { marginTop: 10 },
});

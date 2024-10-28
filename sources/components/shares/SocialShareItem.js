import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView, LinearGradient } from "../views";
import { SOCIAL_CELL_CONTENT_SIDE, SOCIAL_CELL_SIDE } from "./constants";

const SocialShareItem = ({ item, disabled, onPress }) => {
  const theme = useTheme();

  const { type, icon, title, backgroundColor, backgroundColors } = item;

  const cellStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.content,
      backgroundColor,
    };
  }, []);

  return (
    <BounceView
      activeScale={0.9}
      disabledWithoutOpacity={disabled}
      onPress={() => onPress(type)}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cellStyle}
          colors={backgroundColors ?? []}
        >
          <SquareImage
            color="white"
            side={SOCIAL_CELL_CONTENT_SIDE * 0.5}
            source={icon}
          />
        </LinearGradient>
      </View>
      <MainText uppercase bold font="subtitle-3">
        {title}
      </MainText>
    </BounceView>
  );
};

export default memo(SocialShareItem);

const styles = StyleSheet.create({
  container: {
    width: SOCIAL_CELL_SIDE,
    height: SOCIAL_CELL_SIDE * 0.8,
    overflow: "hidden",
    alignItems: "center",
  },
  content: {
    width: SOCIAL_CELL_CONTENT_SIDE,
    height: SOCIAL_CELL_CONTENT_SIDE,
    borderRadius: SOCIAL_CELL_SIDE / 2.2,
    justifyContent: "center",
    alignItems: "center",
  },
});

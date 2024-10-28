import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { generateProfileInterestUri } from "../../hooks/useStaticFeatures";
import { ICON_SIZES } from "../../styles/sizes";
import { CheckmarkButton } from "../buttons";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const ICON_SIDE = ICON_SIZES.two;

const UserInterestCell = ({ selected, interest, onPress }) => {
  const theme = useTheme();

  const { title } = interest;

  const sourceUri = useMemo(() => {
    return generateProfileInterestUri(title);
  }, [title]);

  const contentStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.cell,
    };
  }, []);

  return (
    <BounceView
      onPress={() => {
        onPress(interest);
      }}
      activeScale={0.9}
      style={contentStyle}
    >
      <CacheableImageView source={sourceUri} style={styles.icon} />
      <MainText capitalize bold style={{ marginLeft: 12 }} font="subtitle-1">
        {title}
      </MainText>
      <View style={styles.checkMark}>
        <CheckmarkButton selected={selected} hideUnselected />
      </View>
    </BounceView>
  );
};

export default memo(UserInterestCell);

const styles = StyleSheet.create({
  cell: {
    marginRight: 12,
    marginTop: 12,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  checkMark: {
    position: "absolute",
    bottom: -1,
    right: -1,
  },
  icon: {
    width: ICON_SIDE,
    height: ICON_SIDE,
  },
});

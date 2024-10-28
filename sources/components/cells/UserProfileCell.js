import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { CacheableImageView } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const UserProfileCell = ({
  side,
  user,
  hideLabel,
  style,
  disabled,
  onPress,
}) => {
  const theme = useTheme();

  const picture = user.picture;

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      overflow: "hidden",
      width: side,
      height: side,
      borderRadius: side / 2.2,
    };
  }, [side]);

  return (
    <BounceView
      onPress={() => {
        onPress(user);
      }}
      style={style}
      disabledWithoutOpacity={disabled}
    >
      <View style={containerStyle}>
        <CacheableImageView
          source={picture}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {!hideLabel && (
        <MainText
          numberOfLines={1}
          font="subtitle-4"
          align="center"
          style={{ marginTop: 8 }}
        >
          {user.username}
        </MainText>
      )}
    </BounceView>
  );
};

export default memo(UserProfileCell);

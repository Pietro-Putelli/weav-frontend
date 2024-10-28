import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useTheme } from "../../hooks";
import { removeRecentSearch } from "../../store/slices/utilityReducer";
import { icons } from "../../styles";
import { IconButton } from "../buttons";
import { MainText } from "../texts";
import { BounceView } from "../views";

const LocationCell = ({ location, isRecent, onPress }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { place_name, text } = location;

  const containerStyle = useMemo(() => {
    const commonStyle = {
      ...theme.styles.shadow_round,
      ...styles.container,
    };

    if (isRecent) {
      return {
        ...commonStyle,
        flexDirection: "row",
        alignItems: "center",
      };
    }

    return commonStyle;
  }, []);

  const onRemovePress = useCallback(() => {
    dispatch(removeRecentSearch(location.id));
  }, []);

  return (
    <BounceView haptic onPress={() => onPress(location)} style={containerStyle}>
      <MainText style={{ flex: 1 }} font={"subtitle"}>
        {place_name}
      </MainText>

      {!isRecent && (
        <MainText
          color={theme.white_alpha(0.6)}
          style={styles.subtitle}
          font={"subtitle"}
        >
          {text}
        </MainText>
      )}

      {isRecent && (
        <IconButton source={icons.Cross} inset={4} onPress={onRemovePress} />
      )}
    </BounceView>
  );
};

export default memo(LocationCell);

const styles = StyleSheet.create({
  container: {
    padding: "3%",
    marginVertical: "1%",
  },
  subtitle: {
    marginTop: "2%",
  },
});

import { isEmpty } from "lodash";
import React, { memo, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSearchFashion, useTheme } from "../../hooks";
import { FadeView, InputStatusView } from "../views";
import MainTextInput from "./MainTextInput";

const UniqueTextInput = ({
  onChange,
  style,
  isValid,
  setEnabled,
  ...props
}) => {
  const theme = useTheme();
  const inputRef = useRef();

  const { searchText, onChangeText } = useSearchFashion({ onChange });

  const isSearchEmpty = isEmpty(searchText);

  /* Callbacks */

  const _onChangeText = (text) => {
    onChangeText(text);
    setEnabled(false);
  };

  /* Styles */

  const containerStyle = useMemo(() => {
    return [styles.container, theme.styles.shadow_round];
  }, []);

  return (
    <View style={[containerStyle, style]}>
      <MainTextInput
        font="subtitle"
        ref={inputRef}
        autoCapitalize={"none"}
        autoCorrect={false}
        style={{ flex: 1 }}
        {...props}
        value={searchText}
        onChangeText={_onChangeText}
      />
      <FadeView hidden={isSearchEmpty}>
        <InputStatusView style={{ marginLeft: 8 }} valid={isValid} />
      </FadeView>
    </View>
  );
};

export default memo(UniqueTextInput);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: "4.5%",
  },
});

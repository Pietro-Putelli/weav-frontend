import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { SolidButton } from "../buttons";
import { MainText } from "../texts";

const MisspelledUsernameView = ({ username, isEmail, type }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const usernameTypeStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.username_type,
    };
  }, []);

  return (
    <View style={styles.edit_container}>
      <View style={usernameTypeStyle}>
        <MainText uppercase font="subtitle-4">
          {type}
        </MainText>
        <MainText
          isNumbers={!isEmail}
          style={styles.username}
          font="subtitle-1"
        >
          {username}
        </MainText>
      </View>

      <SolidButton
        onPress={() => {
          navigation.pop();
        }}
        icon={icons.Chevrons.Left}
        title="i mispelled it"
        style={styles.misspelled}
      />
    </View>
  );
};

export default memo(MisspelledUsernameView);

const styles = StyleSheet.create({
  edit_container: {
    marginHorizontal: 16,
  },
  username_type: {
    padding: "4%",
    marginTop: "4%",
  },
  username: { flex: 1, marginTop: "2%", marginLeft: "1%" },
  misspelled: {
    marginTop: "4%",
  },
});

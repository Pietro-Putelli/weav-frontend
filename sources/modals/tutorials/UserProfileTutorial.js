import React, { memo, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { CheckmarkButton, SolidButton } from "../../components/buttons";
import { SquareImage } from "../../components/images";
import { Separator, SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";

/*
    STEPS
    1. Create posts
    2. Real allow messages from everyone
*/

const UserProfileTutorial = ({ setVisible }) => {
  const theme = useTheme();

  const [settings, setSettings] = useState({
    messages: true,
    chances: true,
  });

  const { messages: allowMessages, chances: allowChances } = settings;

  const textContentProps = useMemo(() => {
    return {
      font: "subtitle-1",
      style: styles.content,
    };
  }, []);

  const cellStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.cell,
    };
  }, []);

  return (
    <View>
      <MainText
        style={{ marginHorizontal: "4%" }}
        font="title-6"
        align="center"
      >
        Hey pietro_putelli welcome to your profile
      </MainText>

      <Separator />

      <SeparatorTitle>tap to change settings</SeparatorTitle>

      <BounceView
        haptic
        onPress={() => {
          setSettings({ ...settings, messages: !allowMessages });
        }}
        style={cellStyle}
      >
        <SquareImage source={icons.ColoredChat} side={50} coloredIcon />
        <MainText {...textContentProps}>
          Everyone can send you a message
        </MainText>

        <CheckmarkButton selected={allowMessages} />
      </BounceView>

      <BounceView
        haptic
        onPress={() => {
          setSettings({ ...settings, chances: !allowChances });
        }}
        style={cellStyle}
      >
        <SquareImage source={icons.ColoredChance} side={50} coloredIcon />
        <MainText {...textContentProps}>
          Everyday you can receive a chance to know new people
        </MainText>

        <CheckmarkButton selected={allowChances} />
      </BounceView>

      <SolidButton
        onPress={() => {
          setVisible(false);
        }}
        style={styles.button}
        title="ok, I'm all set"
        type="done"
      />
    </View>
  );
};

export default memo(UserProfileTutorial);

const styles = StyleSheet.create({
  cell: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "4%",
    padding: "4%",
  },
  content: {
    flex: 1,
    marginHorizontal: "4%",
  },
  button: {
    marginTop: "4%",
  },
});

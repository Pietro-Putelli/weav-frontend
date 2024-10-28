import React, { memo } from "react";
import Autolink from "react-native-autolink";
import { useTheme } from "../../hooks";
import MainText from "./MainText";

const MentionText = ({ children, onTagPress, ...props }) => {
  const theme = useTheme();

  return (
    <MainText {...props}>
      <Autolink
        matchers={[
          {
            pattern: /@(?:(?:[\w][\.]{0,1})*[\w]){1,29}/g,
            style: {
              fontWeight: "600",
              color: theme.colors.mention,
              textDecorationLine: "underline",
            },
            onPress: ({ replacerArgs }) => {
              const username = replacerArgs[0].substring(1);
              onTagPress(username);
            },
          },
        ]}
        text={children}
      />
    </MainText>
  );
};

export default memo(MentionText);

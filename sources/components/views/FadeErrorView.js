import { MotiView } from "moti";
import React, { memo, useMemo } from "react";
import { useTheme } from "../../hooks";
import { MainText } from "../texts";

const FadeErrorView = ({ style, visible, solid, children }) => {
  const theme = useTheme();

  const wrongUsernameStyle = useMemo(() => {
    let style = {
      marginTop: "3%",
      marginHorizontal: "4%",
    };

    if (solid) {
      style = {
        ...style,
        padding: 12,
        paddingHorizontal: 20,
        ...theme.styles.shadow_round,
      };
    }

    return style;
  }, [solid]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: visible ? 1 : 0, translateY: visible ? 0 : 10 }}
      style={[wrongUsernameStyle, style]}
    >
      <MainText
        bold
        align={"center"}
        font="subtitle-3"
        uppercase
        color={theme.colors.red}
        style={{
          letterSpacing: 2,
          includeFontPadding: false,
          paddingTop: 4,
        }}
      >
        {children}
      </MainText>
    </MotiView>
  );
};

export default memo(FadeErrorView);

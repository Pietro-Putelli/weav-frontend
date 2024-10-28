import React, { memo, useMemo } from "react";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { isEmpty } from "lodash";
import { View } from "react-native";

const LinearGradient = ({ style, colors, inverted, children, ...props }) => {
  if (isEmpty(colors)) {
    return <View style={style}>{children}</View>;
  }

  const { start, end } = useMemo(() => {
    return {
      start: { x: inverted ? 1 : 0, y: inverted ? 1 : 0 },
      end: { x: inverted ? 1 : 0, y: inverted ? 0 : 1 },
    };
  }, [inverted]);

  return (
    <ExpoLinearGradient
      start={start}
      end={end}
      style={style}
      colors={colors}
      {...props}
    >
      {children}
    </ExpoLinearGradient>
  );
};

export default memo(LinearGradient);

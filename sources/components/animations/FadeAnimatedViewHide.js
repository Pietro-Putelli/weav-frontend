import { MotiView } from "moti";
import React, { memo } from "react";

const FadeAnimatedViewHide = ({ visible, mode, children, ...props }) => {
  return (
    <MotiView
      from={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0, translateX: visible ? 0 : 0 }}
      {...props}
    >
      {children}
    </MotiView>
  );
};
export default memo(FadeAnimatedViewHide);

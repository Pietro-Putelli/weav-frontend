import React, { memo, useRef } from "react";
import FadeAnimatedView from "./FadeAnimatedView";

const FirstLoadingAnimatedView = ({ isLoading, children, ...props }) => {
  const isDisabled = useRef(!isLoading);

  if (isLoading) {
    return null;
  }

  return (
    <FadeAnimatedView disabled={isDisabled.current} {...props}>
      {children}
    </FadeAnimatedView>
  );
};

export default memo(FirstLoadingAnimatedView);

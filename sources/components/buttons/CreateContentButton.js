import React from "react";
import { useTheme } from "../../hooks";
import { icons } from "../../styles";
import { SquareImage } from "../images";
import { BounceView, LoaderView } from "../views";

const CreateContentButton = ({ style, isLoading, iconSide, ...props }) => {
  const theme = useTheme();

  return (
    <BounceView
      haptic
      activeScale={0.9}
      style={[
        style,
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.main_accent,
        },
      ]}
      {...props}
    >
      {isLoading ? (
        <LoaderView percentage={0.7} isLoading />
      ) : (
        <SquareImage side={iconSide} source={icons.Arrows.Right} />
      )}
    </BounceView>
  );
};

export default CreateContentButton;

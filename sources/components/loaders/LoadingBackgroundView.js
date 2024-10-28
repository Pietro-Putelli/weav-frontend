import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { MainText } from "../texts";
import LoaderView from "../views/LoaderView";

const LoadingBackground = ({ solid, isLoading, children }) => {
  const theme = useTheme();

  if (!isLoading) return null;

  return (
    <FadeAnimatedView
      mode="fade"
      style={{
        zIndex: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: solid ? theme.colors.background : "rgba(0,0,0,0.5)",
        ...StyleSheet.absoluteFillObject,
      }}
    >
      <LoaderView percentage={1.2} />
      <MainText style={{ marginTop: "6%" }} font={"subtitle"}>
        {children}
      </MainText>
    </FadeAnimatedView>
  );
};

export default memo(LoadingBackground);

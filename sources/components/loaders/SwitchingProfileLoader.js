import React from "react";
import { useLanguages } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { MainText } from "../texts";
import { LoaderView } from "../views";

const SwitchingProfileLoader = () => {
  const { languageContent } = useLanguages();

  return (
    <FadeAnimatedView
      mode="fade"
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoaderView style={{ marginBottom: "4%" }} />

      <MainText font="title-7">{languageContent.switching_profile}</MainText>
    </FadeAnimatedView>
  );
};

export default SwitchingProfileLoader;

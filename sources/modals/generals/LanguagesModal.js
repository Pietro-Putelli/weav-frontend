import React, { memo, useState } from "react";
import { CheckableCell } from "../../components/cells";
import { MainText } from "../../components/texts";
import { LoadingBackgroundView } from "../../components/loaders";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import ModalScreen from "../ModalScreen";

const LanguagesModal = () => {
  const { language, languagesList, languageContent, changeLanguage } =
    useLanguages();

  const [visible, setVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onPress = (code) => {
    setIsLoading(true);

    setTimeout(() => {
      changeLanguage(code);
    }, 200);

    setTimeout(() => {
      setVisible(false);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <ModalScreen visible={visible} cursor>
        <MainText font="subtitle-1" align="center" bold>
          {languageContent.language_modal_title}
        </MainText>

        {languagesList.map(({ title, code }) => {
          return (
            <CheckableCell
              key={title}
              title={title}
              icon={icons.Flags[code]}
              selected={language == code}
              onPress={() => onPress(code)}
            />
          );
        })}
      </ModalScreen>

      <LoadingBackgroundView solid isLoading={isLoading} />
    </>
  );
};

export default memo(LanguagesModal);

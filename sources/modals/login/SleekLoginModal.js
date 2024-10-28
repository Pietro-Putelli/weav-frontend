import React, { useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { SolidButton } from "../../components/buttons";
import { ProfilePicture } from "../../components/images";
import { MainText } from "../../components/texts";
import { saveUserLoginData } from "../../handlers/user";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import ModalScreen from "../ModalScreen";

const PROFILE_PICTURE_SIDE = widthPercentage(0.3);

const SleekLoginModal = ({ user }) => {
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(true);

  const { languageContent } = useLanguages();

  return (
    <ModalScreen visible={visible} disabled>
      <View style={{ alignItems: "center", marginTop: "6%" }}>
        <ProfilePicture side={PROFILE_PICTURE_SIDE} source={user.picture} />

        <View style={{ marginTop: "6%" }}>
          <MainText
            bold
            font="title-7"
            style={{ marginHorizontal: "3%" }}
            align="center"
          >
            {languageContent.welcome_back} {user.name}
          </MainText>
        </View>

        <View style={{ marginTop: "6%", width: "90%" }}>
          <SolidButton
            type="done"
            rightIcon={icons.Arrows.Right}
            title={languageContent.buttons.login_now}
            onPress={() => {
              dispatch(saveUserLoginData(user));
            }}
          />
          <SolidButton
            style={{ marginTop: "4%" }}
            onPress={() => {
              setVisible(false);
            }}
            title={languageContent.buttons.use_another_account}
          />
        </View>
      </View>
    </ModalScreen>
  );
};

export default SleekLoginModal;

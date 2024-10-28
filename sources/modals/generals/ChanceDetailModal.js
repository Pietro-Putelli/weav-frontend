import React from "react";
import { View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { ProfilePicture } from "../../components/images";
import { MainText } from "../../components/texts";
import ModalScreen from "../ModalScreen";

const ChanceDetailModal = ({ chance }) => {
  const { user, event } = chance;

  return (
    <ModalScreen cursor>
      <View style={{ alignItems: "center" }}>
        <ProfilePicture side={100} source={user.picture} />

        <View style={{ marginTop: "6%" }}>
          <MainText font="title-7">{user.username}</MainText>
        </View>
      </View>
      <View style={{ flexDirection: "row", marginTop: "4%" }}>
        <SolidButton flex title="message" type="done" marginRight />
        <SolidButton flex title="ignore" />
      </View>
    </ModalScreen>
  );
};

export default ChanceDetailModal;

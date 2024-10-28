import React, { memo } from "react";
import { Image, View } from "react-native";
import { SolidButton } from "../../components/buttons";
import { MainText } from "../../components/texts";
import { useLanguages, useUser } from "../../hooks";
import { images } from "../../styles";
import { widthPercentage } from "../../styles/sizes";
import { contactSupportTeam } from "../../utility/shareApis";
import FullSheetModal from "../FullSheetModal";

const IMAGE_WIDTH = widthPercentage(0.8);

const ContactUsModal = () => {
  const { languageContent } = useLanguages();
  const user = useUser();

  const title = languageContent.dear + " " + user.name;

  return (
    <FullSheetModal title={title} contentStyle={{ paddingHorizontal: "4%" }}>
      <View style={{ marginBottom: "4%", alignItems: "center" }}>
        <Image
          source={images.CustomerService}
          style={{ width: IMAGE_WIDTH, height: 200 }}
        />
      </View>

      <MainText style={{ marginTop: "4%" }} align="center" font="subtitle">
        {languageContent.contact_us_content}
      </MainText>

      <View style={{ marginTop: "8%" }}>
        <SolidButton
          type="done"
          onPress={contactSupportTeam}
          title={languageContent.buttons.contact_us}
        />
      </View>
    </FullSheetModal>
  );
};

export default memo(ContactUsModal);

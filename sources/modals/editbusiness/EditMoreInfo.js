import { pick } from "lodash";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SolidButton } from "../../components/buttons";
import { CheckableCell } from "../../components/cells";
import { MainTextInput } from "../../components/inputs";
import { useLanguages } from "../../hooks";
import { icons } from "../../styles";

const EditMoreInfo = ({
  data,
  onDataChanged,
  onDonePress,
  business,
  isEventProfile,
}) => {
  const initialData = pick(
    business,
    "description",
    "nearby_info",
    "price_target",
    "allow_chat"
  );

  const { languageContent } = useLanguages();

  const onChangeText = (key, value) => {
    onDataChanged({ ...initialData, ...data, [key]: value });
  };

  const inputStyle = {
    marginVertical: "1.5%",
  };

  return (
    <ScrollView scrollEnabled={false}>
      {!isEventProfile && (
        <MainTextInput
          solid
          coloredIcon
          value={data.menu_url}
          keyboardType="url"
          onChangeText={(value) => onChangeText("menu_url", value)}
          icon={icons.ColoredMenu}
          style={inputStyle}
          placeholder={languageContent.menu_url}
          autoCapitalize="none"
        />
      )}

      <MainTextInput
        solid
        coloredIcon
        value={data.ticket_url}
        keyboardType="url"
        onChangeText={(value) => onChangeText("ticket_url", value)}
        icon={icons.ColoredTickets}
        placeholder={languageContent.ticket_url}
        style={inputStyle}
        autoCapitalize="none"
      />

      <MainTextInput
        solid
        coloredIcon
        autoCorret={false}
        keyboardType="url"
        autoComplete="off"
        autoCorrect={false}
        value={data.web_url}
        onChangeText={(value) => onChangeText("web_url", value)}
        icon={icons.ColoredLink}
        style={inputStyle}
        placeholder={languageContent.website_url}
        autoCapitalize="none"
      />

      <MainTextInput
        coloredIcon
        autoCorret={false}
        autoComplete="off"
        value={data.instagram}
        onChangeText={(value) => onChangeText("instagram", value)}
        icon={icons.ColoredInstagram}
        solid
        style={inputStyle}
        placeholder={languageContent.instagram_profile}
        autoCapitalize="none"
      />

      <CheckableCell
        style={{ marginTop: "2%" }}
        item={{
          title: languageContent.allow_users_to_chat_with_you,
          subtitle: languageContent.allow_users_to_chat_with_you_content,
        }}
        selected={data.allow_chat}
        onPress={() => onChangeText("allow_chat", !data.allow_chat)}
      />

      <SolidButton
        haptic
        type="done"
        title="done"
        icon={icons.Done}
        onPress={onDonePress}
        style={{ marginTop: "6%", marginBottom: "4%" }}
      />
    </ScrollView>
  );
};

export default EditMoreInfo;

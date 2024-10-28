import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { useDispatch } from "react-redux";
import {
  FadeAnimatedView,
  FadeAnimatedViewHide,
} from "../../components/animations";
import { SolidButton } from "../../components/buttons";
import { OTPView } from "../../components/phone";
import { MainText } from "../../components/texts";
import { deleteCurrentBusiness } from "../../handlers/business";
import { useLanguages, useTheme } from "../../hooks";
import { typographies } from "../../styles";
import FullSheetModal from "../FullSheetModal";

const generateToken = () => {
  return (Math.floor(Math.random() * 90000) + 10000).toString();
};

const DeleteVenueModal = ({ onDeleted }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const [deleteTriggerd, setDeleteTriggered] = useState(false);
  const [token, setToken] = useState(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (deleteTriggerd) {
      setToken(generateToken());
    }
  }, [deleteTriggerd]);

  const onDeletePress = () => {
    onDeleted?.();

    dispatch(deleteCurrentBusiness());

    navigation.dismissModal();
  };

  return (
    <FullSheetModal
      contentStyle={{
        paddingTop: "4%",
        marginHorizontal: "2%",
        alignItems: "center",
      }}
    >
      <FadeAnimatedViewHide visible={!deleteTriggerd}>
        <MainText font="title-6" align="center">
          {languageContent.delete_business_alert}
        </MainText>

        <View style={{ marginTop: "8%" }}>
          <SolidButton
            type="done"
            title={languageContent.brind_me_back_to_reason}
            onPress={() => {
              navigation.dismissModal();
            }}
          />
          <SolidButton
            title="continue"
            style={{ marginTop: "4%" }}
            onPress={() => {
              setDeleteTriggered(true);
            }}
          />
        </View>
      </FadeAnimatedViewHide>

      {deleteTriggerd && (
        <FadeAnimatedView
          style={{
            marginTop: "4%",
            position: "absolute",
            marginHorizontal: "2%",
          }}
        >
          <MainText font="title-6" align="center" bold>
            {languageContent.proceed_to_delete}
          </MainText>

          <View
            style={[
              theme.styles.shadow_round,
              {
                alignSelf: "center",
                padding: "3%",
                marginTop: "8%",
                marginBottom: "4%",
              },
            ]}
          >
            <MainText
              font="phone"
              style={{
                fontSize: typographies.fontSizes.title4,
                letterSpacing: 4,
              }}
              align="center"
              bold
            >
              {token}
            </MainText>
          </View>

          <OTPView
            hideResend
            onCodeFilled={(code) => {
              if (token == code) {
                setEnabled(true);
              }
            }}
          />

          <SolidButton
            type="delete"
            disabled={!enabled}
            title={languageContent.buttons.confirm_deletion}
            style={{ marginTop: "8%" }}
            loadingOnPress
            onPress={onDeletePress}
          />
        </FadeAnimatedView>
      )}
    </FullSheetModal>
  );
};

export default DeleteVenueModal;

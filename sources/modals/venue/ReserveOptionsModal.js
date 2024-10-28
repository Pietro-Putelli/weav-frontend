import { isEmpty, isNull } from "lodash";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SingleTitleCell } from "../../components/cells";
import { SquareImage } from "../../components/images";
import { SeparatorTitle } from "../../components/separators";
import { MainText } from "../../components/texts";
import { BounceView } from "../../components/views";
import { useLanguages, useTheme } from "../../hooks";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { openWeb } from "../../utility/linking";
import ModalScreen from "../ModalScreen";

const PROVIDERS = ["Glovo", "Deliveroo", "Ubereats", "Justeat"];

const OPTIONS = PROVIDERS.map((provider) => {
  return {
    title: provider,
    icon: icons[provider],
  };
});

const ReserveOptionsModal = ({
  isChatAllowed,
  deliveryOptions,
  isPhoneNumberAllowed,
  onChatPress,
  onPhonePress,
  showOnlyContacts,
}) => {
  const [visible, setVisible] = useState(true);

  const theme = useTheme();
  const { languageContent } = useLanguages();

  const [customLink, setCustomLink] = useState(null);

  const orderOptions = useMemo(() => {
    return deliveryOptions
      .map((option) => {
        const provider = OPTIONS.find((provider) => {
          return option.includes(provider.title.toLowerCase());
        });

        if (!provider) {
          setCustomLink({
            title: languageContent.order_online,
            link: option,
          });
          return null;
        }

        return {
          title: provider.title,
          icon: provider.icon,
          link: option,
        };
      })
      .filter((option) => !isNull(option));
  }, []);

  const hasNoContacts = !isChatAllowed && !isPhoneNumberAllowed;
  const hasNoDeliveryOptions = isEmpty(orderOptions) || showOnlyContacts;

  return (
    <ModalScreen visible={visible} cursor>
      {!hasNoDeliveryOptions && (
        <>
          <SeparatorTitle>{languageContent.order_with}</SeparatorTitle>

          <View style={{ marginTop: "1%" }}>
            {orderOptions.map((option) => {
              return (
                <BounceView
                  onPress={() => {
                    openWeb(option.link);
                  }}
                  key={option.title}
                  style={[styles.orderCell, theme.styles.shadow_round]}
                >
                  <SquareImage
                    source={option.icon}
                    side={ICON_SIZES.one}
                    coloredIcon
                  />
                  <MainText
                    style={styles.cellTitle}
                    font="subtitle-2"
                    uppercase
                  >
                    {option.title}
                  </MainText>

                  <SquareImage
                    source={icons.Chevrons.Right}
                    side={ICON_SIZES.chevron_right}
                    color={theme.colors.thirdText}
                  />
                </BounceView>
              );
            })}
          </View>
        </>
      )}

      {!hasNoContacts && (
        <SeparatorTitle
          style={{
            marginBottom: "1%",
            marginTop: hasNoDeliveryOptions ? 0 : 4,
          }}
        >
          {languageContent.contacts}
        </SeparatorTitle>
      )}

      {!isNull(customLink) && (
        <SingleTitleCell
          title={customLink.title}
          icon={icons.Link}
          onPress={() => {
            openWeb(customLink.link);
          }}
        />
      )}

      {isPhoneNumberAllowed && (
        <SingleTitleCell
          title={languageContent.actions.call}
          icon={icons.Phone}
          onPress={onPhonePress}
        />
      )}

      {isChatAllowed && (
        <SingleTitleCell
          onPress={() => {
            setVisible(false);

            onChatPress();
          }}
          icon={icons.Paperplane}
          title="chat"
        />
      )}
    </ModalScreen>
  );
};

export default ReserveOptionsModal;

const styles = StyleSheet.create({
  orderCell: {
    padding: "4%",
    marginBottom: "3%",
    flexDirection: "row",
    alignItems: "center",
  },
  cellTitle: {
    flex: 1,
    marginHorizontal: "4%",
  },
});

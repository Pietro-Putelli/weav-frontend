import _, { pick } from "lodash";
import React, { memo, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch } from "react-redux";
import BusinessAPI from "../../backend/business";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import {
  pushNavigation,
  showModalNavigation,
  showSheetNavigation,
  showStackModal,
} from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import { makeCall, openInstagram } from "../../utility/linking";
import { formatShareBusiness } from "../../utility/shareApis";
import { LikeButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");

const BUTTON_SIDE = (width - 16 * 6) / 5;
const ICON_SIDE = ICON_SIZES.two * 0.9;

const activeScale = 0.9;

const ButtonsView = ({ business, isPreview, componentId }) => {
  const dispatch = useDispatch();
  const { languageContent } = useLanguages();

  const onLikedPress = () => {
    dispatch(BusinessAPI.handleLike(business.id));
  };

  const caseItems = useMemo(() => {
    const actions = languageContent.actions;

    return [
      { title: actions.repost, icon: icons.Repost, type: 0 },
      { title: actions.share, icon: icons.ShareEmpty, type: 1 },
      { title: actions.contact, icon: icons.Paperplane, type: 7 },
      { title: actions.map, icon: icons.Marker1, type: 3 },
      { title: actions.phone, icon: icons.Phone, type: 2 },
      { title: "menu", icon: icons.VenueMenu, type: 4 },
      { title: "instagram", icon: icons.Instagram, type: 5 },
      { title: actions.website, icon: icons.Link, type: 6 },
      { title: actions.tickets, icon: icons.Ticket, type: 8 },
    ];
  }, []);

  const items = useMemo(() => {
    const items = [caseItems[0], "", caseItems[1], caseItems[2], caseItems[3]];

    if (!business.allow_chat) {
      delete items[3];
    }

    if (business.phone) items.push(caseItems[4]);
    if (business.menu_url) items.push(caseItems[5]);
    if (business.instagram) items.push(caseItems[6]);
    if (business.web_url) items.push(caseItems[7]);
    if (business.ticket_url) items.push(caseItems[8]);

    return items;
  }, [business]);

  const onPress = (type) => {
    switch (type) {
      case 0:
        showStackModal({
          screen: SCREENS.CreateMoment,
          passProps: {
            initialMoment: {
              business_tag: {
                type: "business_tag",
                ...pick(business, ["id", "name", "cover_source"]),
              },
            },
          },
        });
        break;
      case 1:
        showModalNavigation({
          screen: SCREENS.Share,
          passProps: { business: formatShareBusiness(business) },
        });
        break;
      case 2:
        makeCall(business.phone);
        break;
      case 3:
        showSheetNavigation({
          screen: SCREENS.MapSelector,
          passProps: {
            ..._.pick(business.location, ["coordinate", "address"]),
            name: business.name,
          },
        });
        break;
      case 4:
        openWebView(business.menu_url);
        break;
      case 5:
        openInstagram(business.instagram);
        break;
      case 6:
        openWebView(business.web_url);
        break;
      case 7:
        pushNavigation({
          componentId,
          screen: SCREENS.ChatMessage,
          passProps: {
            business: business,
            popOnPress: true,
          },
        });
        break;
      case 8:
        openWebView(business.ticket_url);
      default:
        break;
    }
  };

  const openWebView = (url) => {
    pushNavigation({
      componentId,
      screen: SCREENS.Web,
      passProps: { url },
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item, index) => {
        if (index == 1)
          return (
            <LikeView
              liked={business.me.liked}
              onPress={onLikedPress}
              key={index}
              enabled={!isPreview}
            />
          );
        else
          return (
            <Button
              disabled={isPreview}
              {...{ item, index, onPress }}
              key={index}
            />
          );
      })}
    </ScrollView>
  );
};
export default memo(ButtonsView);

const Button = ({ item, index, onPress, disabled }) => {
  const theme = useTheme();

  const backgroundColor =
    index == 0 ? theme.colors.main_accent : theme.colors.second_background;

  return (
    <View style={styles.buttonContainer}>
      <BounceView
        disabledWithoutOpacity={disabled}
        activeScale={activeScale}
        onPress={() => onPress(item.type)}
        style={[theme.styles.shadow, { backgroundColor }, styles.button]}
      >
        <SquareImage source={item.icon} color={"white"} side={ICON_SIDE} />
      </BounceView>
      <MainText align="center" uppercase style={styles.subtitle}>
        {item.title}
      </MainText>
    </View>
  );
};

const LikeView = (props) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  return (
    <View>
      <View style={[theme.styles.shadow, styles.button]}>
        <LikeButton
          {...props}
          like={props.liked}
          tint={theme.white_alpha(0.8)}
        />
      </View>
      <MainText
        uppercase
        align="center"
        font="subtitle-4"
        style={styles.subtitle}
      >
        {languageContent.actions.like}
      </MainText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginBottom: "2%",
  },
  button: {
    marginHorizontal: 8,
    width: BUTTON_SIDE,
    height: BUTTON_SIDE,
    borderRadius: BUTTON_SIDE / 2.2,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: { marginTop: 8, fontSize: RFValue(9) },
  buttonContainer: {
    alignItems: "center",
  },
});

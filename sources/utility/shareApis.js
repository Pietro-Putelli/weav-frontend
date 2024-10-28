import { META_API_KEY } from "@env";
import Clipboard from "@react-native-clipboard/clipboard";
import { pick } from "lodash";
import { Share } from "react-native";
import { default as RNShare } from "react-native-share";
import { PUBLIC_DOMAIN } from "../backend/endpoints";
import { INSTAGRAM_BACKGROUND_URL } from "../backend/urls";
import { getLanguageContent } from "../hooks/useLanguages";
import { convertToBase64FromLocalUrl } from "./filesystem";
import { safeOpenUrl, sendMail } from "./linking";

export const shareOnWhatsApp = async ({ text, ...params }) => {
  let content = text;

  if (!text) {
    content = generateContentUrl(params);
  }

  safeOpenUrl(`whatsapp://send?text=${content}`);
};

export const shareOnTelegram = ({ text, ...params }) => {
  let content = text;

  if (!text) {
    content = generateContentUrl(params);
  }

  safeOpenUrl(`tg://msg?text=${content}`);
};

export const shareOnInstagram = async (sourceUrl, callback) => {
  const base64 = await convertToBase64FromLocalUrl(sourceUrl);

  const shareOptions = {
    backgroundImage: INSTAGRAM_BACKGROUND_URL,
    stickerImage: "data:image/png;base64," + base64,
    social: RNShare.Social.INSTAGRAM_STORIES,
    appId: META_API_KEY,
  };

  RNShare.shareSingle(shareOptions)
    .then(() => {
      callback();
    })
    .catch((err) => {
      callback();
      console.log(err);
    });
};

export const generateContentUrl = ({ event, businessId }) => {
  let domain = PUBLIC_DOMAIN;

  if (event) {
    domain += `?event=${event.id}`;
  } else if (businessId) {
    domain += `?business=${businessId}`;
  }

  return domain;
};

export const copyLinkFor = ({ text, ...params }) => {
  let content = text;

  if (!text) {
    content = generateContentUrl(params);
  }

  Clipboard.setString(content);
};

export const shareMore = ({ text, ...params }) => {
  let url = "";

  if (!text) {
    url = generateContentUrl(params);
  }

  const { languageContent } = getLanguageContent();
  const { join_weav, weav_tagline } = languageContent;

  Share.share({
    url,
    title: join_weav,
    message: text ?? weav_tagline,
  }).then(() => {});
};

export const shareOnSocial = ({ type, onInstagram, onCopy, ...props }) => {
  switch (type) {
    case "whatsapp":
      shareOnWhatsApp(props);
      break;
    case "telegram":
      shareOnTelegram(props);
      break;
    case "instagram":
      onInstagram?.();
      break;
    case "copy":
      onCopy?.();
      break;
    case "more":
      shareMore(props);
      break;
  }
};

/* Use to contact the support team */
export const contactSupportTeam = () => {
  sendMail("info@weav.it");
};

export const formatShareEventForInstagram = ({ event, business }) => {
  const owner = event?.business ?? business;

  const source = event?.cover ?? event?.picture;

  return {
    source,
    periodicDay: event?.periodic_day,
    businessName: owner?.name,
    city: owner?.city ?? event?.location?.city ?? business?.location?.city,
    ...pick(event, ["title", "date", "id"]),
  };
};

export const formatShareBusiness = (business) => {
  return {
    id: business.id,
    source: business.cover_source,
    city: business?.city ?? business?.location?.city,
    title: business.name,
  };
};

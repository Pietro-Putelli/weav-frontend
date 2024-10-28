import { Linking } from "react-native";
import { formatPhone } from "./formatters";

export const safeOpenUrl = (url) => {
  Linking.openURL(url)
    .then(() => {})
    .catch(() => {});
};

export const makeCall = (phone) => {
  const formatted = formatPhone({ phone, isPlain: true });
  const telUrl = `tel:${formatted}`;
  safeOpenUrl(telUrl);
};

export const openInstagram = (username) => {
  const instagramUrl = `instagram://user?username=${username}`;
  safeOpenUrl(instagramUrl);
};

export const openWeb = (url) => {
  if (!url) return;
  let newUrl = url;

  const PROTOCOLS = ["http://", "https://"];

  if (!PROTOCOLS.some((protocol) => url.includes(protocol))) {
    newUrl = PROTOCOLS[0] + url;
  }

  safeOpenUrl(newUrl);
};

export const sendMail = (email) => {
  safeOpenUrl("mailto:" + email);
};

export const openMainEmailProvider = () => {
  const url = "googlegmail://";

  Linking.openURL(url).catch((e) => {
    /* If you can't open Gmail, open Apple Mail */
    Linking.openURL("message:");
  });
};

export const contactSupport = () => {
  sendMail("info@weav.it");
};

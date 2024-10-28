import moment from "moment";
import { momentlocale } from ".";
import { isAmPmTimeFormat } from "./localeUtils";

const dateFormats = {
  YYYY_MM_DD: "YYYY-MM-DD",
  ddd_D_MMM: "ddd, D MMM",
  ddd: "ddd",
  DD: "DD",
  MMM: "MMM",
  MMM_DD: "MMM DD",
  MMM_dd: "MMM dd",
  MMM_D: "MMM D",
  HH_mm: "HH:mm",
  TIMEZONE: "YYYY-MM-DD HH:mm Z",
};

export default dateFormats;

export const getMMMDDFormat = () => {
  if (momentlocale.locale() === "en") {
    return "MMM DD";
  } else {
    return "DD MMM";
  }
};

export const getMMMDo = () => {
  if (momentlocale.locale() === "en") {
    return "MMM Do";
  } else {
    return "DD MMMM";
  }
};

export const getTimeFormatFor = (time) => {
  return isAmPmTimeFormat(time) ? "hh:mm A" : "HH:mm";
};

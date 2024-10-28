import { getLanguageContent } from "../../hooks/useLanguages";
import { icons } from "../../styles";

const { languageContent } = getLanguageContent();

const shareItems = [
  // {
  //   title: "Instagram",
  //   icon: icons.Instagram,
  //   backgroundColors: ["#405DE6", "#833AB4", "#E1306C", "#F56040", "#FFDC80"],
  //   type: "instagram",
  // },
  {
    title: "WhatsApp",
    icon: icons.Whatsapp,
    backgroundColor: "#1dbf58",
    type: "whatsapp",
  },
  {
    title: "Telegram",
    icon: icons.Telegram,
    backgroundColor: "#2593cc",
    type: "telegram",
  },
  {
    title: languageContent.actions.copy_link,
    icon: icons.Link,
    backgroundColor: "#0c856f",
    type: "copy",
  },
  {
    title: languageContent.actions.more,
    icon: icons.More,
    backgroundColor: "#110D21",
    type: "more",
  },
  {
    title: languageContent.actions.report,
    icon: icons.Flag,
    backgroundColor: "#bf1d3d",
    type: "report",
  },
];

export default shareItems;

import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export const formatAssets = (items) => {
  let sections = [];

  let section = [];
  let sectionId = uuidv4();

  for (const index in items) {
    if (section.length === 3) {
      section = [];
      sectionId = uuidv4();
    }

    const alreadyIn = _.includes(
      sections.flat().map((section) => section.id),
      sectionId
    );

    section.push(items[index]);

    if (section.length > 0 && !alreadyIn) {
      sections.push({ assets: section, id: String(sectionId) });
    }
  }

  return sections;
};

export const formatVideoDuration = (duration) => {
  if (duration < 10) return `0:0${duration.toFixed(0)}`;
  else if (duration == 60) return "1:00";
  return `${Math.floor(duration / 60)}:${(duration % 60).toFixed(0)}`;
};

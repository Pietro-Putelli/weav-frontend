import { pick } from "lodash";
import { getUserPositionData } from "../../store/store";
import { removeAllNewEmptyLines } from "../../utility/strings";
import { appendSourceTo, isInFileSystem } from "./utility";

const getCreateMomentFormData = ({ moment, participants }) => {
  const { content, location_tag, url_tag, business_tag, event } = moment;

  const source = moment?.source;

  let newData = pick(moment, ["content", "duration", "is_anonymous"]);

  if (participants) {
    newData.participants = participants.map((participant) => {
      return participant.id;
    });
  }

  newData.content = removeAllNewEmptyLines(content);

  const userPosition = getUserPositionData();
  newData.location = pick(userPosition, ["coordinate", "place_id"]);

  if (source && isInFileSystem(source?.uri)) {
    if (source?.width) {
      const { width, height } = source;

      newData.ratio = (height / width).toFixed(1);
    }
  }

  if (business_tag) {
    newData.business_tag = business_tag?.id;
  }

  if (url_tag) {
    newData.url_tag = url_tag.value;
  }

  if (event) {
    newData.eventId = event.id;
  }

  if (location_tag) {
    newData = {
      ...newData,
      location_tag: {
        address: location_tag.value,
        coordinate: location_tag.coordinate,
      },
    };
  }

  return JSON.stringify(newData);
};

/* Use to format USER-MOMENT-CREATION */

export const formatUserMoment = async ({ moment, participants }) => {
  const formData = new FormData();

  const source = moment?.source;

  if (source) {
    await appendSourceTo(formData, { source });
  }

  const data = getCreateMomentFormData({ moment, participants });
  formData.append("data", data);

  return formData;
};

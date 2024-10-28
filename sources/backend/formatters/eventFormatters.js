import { isUndefined, omit } from "lodash";
import { momentlocale } from "../../dates";
import { getWeekDayIndexFor } from "../../dates/functions";
import { isAmPmTimeFormat } from "../../dates/localeUtils";
import { getChangedFields } from "../../utility/collections";
import { formatLink, removeAllNewEmptyLines } from "../../utility/strings";
import { appendSourceTo, isInFileSystem } from "./utility";

/* Use to format EVENT-MOMENT-CREATION */

export const formatEvent = async ({ event, prevEvent, isEditing }) => {
  const formData = new FormData();

  const cover = event?.cover;

  let newEvent = omit(event, ["date", "cover", "isPeriodic"]);

  if (isEditing) {
    newEvent = getChangedFields({
      prev: prevEvent,
      next: event,
    });

    newEvent.eventId = event.id;
    newEvent.title = event.title;
  }

  newEvent.ticket = formatLink(newEvent.ticket);
  newEvent.website = formatLink(newEvent.website);
  newEvent.description = removeAllNewEmptyLines(newEvent.description);

  if (event.isPeriodic) {
    newEvent.periodic_day = getWeekDayIndexFor(event.date);
    newEvent.date = null;
  } else {
    newEvent.date = event.date;
  }

  const eventStartTime = newEvent?.time;
  const eventEndTime = newEvent?.end_time;

  const isAmPmStartTime = isAmPmTimeFormat(eventStartTime);
  const isApPmEndTime = isAmPmTimeFormat(eventEndTime);

  if (isAmPmStartTime || isApPmEndTime) {
    if (!isUndefined(eventStartTime)) {
      newEvent.time = momentlocale(eventStartTime, "hh:mm A").format("HH:mm");
    }

    if (!isUndefined(eventEndTime)) {
      newEvent.end_time = momentlocale(eventEndTime, "hh:mm A").format("HH:mm");
    }
  }

  if (cover && isInFileSystem(cover)) {
    await appendSourceTo(formData, { source: cover, name: "cover" });

    const { width, height } = cover;
    newEvent.ratio = (height / width).toFixed(1);
  }

  formData.append("data", JSON.stringify(newEvent));

  return formData;
};

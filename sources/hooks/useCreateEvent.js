import {
  cloneDeep,
  differenceBy,
  isEmpty,
  isEqual,
  isUndefined,
  omit,
  pick,
  size,
  uniqueId,
} from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventsAPI from "../backend/events";
import { formatEvent } from "../backend/formatters/eventFormatters";
import { getMyBusinessEventByIdState } from "../store/slices/eventsReducer";
import { getChangedFields, remapUsingIds } from "../utility/collections";
import { isValidText } from "../utility/validators";

const FIELDS_TO_REMOVE_FOR_CHANGE = ["parts", "ref", "event"];

const useCreateEvent = ({ eventId, initialEvent }) => {
  const [event, setEvent] = useState({});
  const [isCoverInvalid, setIsCoverInvalid] = useState(false);

  const [isLoading, setIsLoading] = useState();

  const isEditing = !isUndefined(eventId);

  const editedEvent = useSelector((state) => {
    if (eventId == undefined) {
      return null;
    }

    return getMyBusinessEventByIdState(state, eventId);
  });

  /* Utility */

  const dispatch = useDispatch();

  /* Effects */

  useEffect(() => {
    if (initialEvent) {
      setEvent(initialEvent);
    }
  }, []);

  useEffect(() => {
    if (editedEvent) {
      setEvent(editedEvent);
    }
  }, [editedEvent]);

  /* Props */

  const hasEventChanged = useMemo(() => {
    const beforeChanges = omit(editedEvent, FIELDS_TO_REMOVE_FOR_CHANGE);
    const afterChanges = omit(event, FIELDS_TO_REMOVE_FOR_CHANGE);

    return !isEqual(beforeChanges, afterChanges);
  }, [event, editedEvent]);

  const isScheduleValid = useMemo(() => {
    const startTime = event?.time;
    const endTime = event?.end_time;

    const isValidStartTime = !isUndefined(startTime);
    const isValidEndTime = !isUndefined(endTime);

    return isValidStartTime && isValidEndTime;
  }, [event]);

  const isDoneEnabled = useMemo(() => {
    const isValidDate = !isUndefined(event?.date);
    const isValidTitle = isValidText({ text: event?.title, minLength: 5 });

    const isValid = isValidDate && isScheduleValid && isValidTitle;

    const eventChanges = getChangedFields({
      prev: editedEvent,
      next: event,
    });

    if (isEditing) {
      return !isEmpty(eventChanges);
    }

    return isValid;
  }, [event]);

  /* Methods */

  const updateEventState = (props) => {
    setEvent((event) => {
      return { ...event, ...props };
    });
  };

  const createOrUpdateEvent = async (callback) => {
    if (isLoading) {
      return;
    }

    if (!hasEventChanged) {
      callback();

      return;
    }

    setIsLoading(true);

    const data = await formatEvent({
      event,
      prevEvent: editedEvent,
      isEditing,
    });

    dispatch(
      EventsAPI.createOrUpdate({ data, isEditing }, ({ isDone, isInvalid }) => {
        setIsLoading(false);

        if (isInvalid) {
          setIsCoverInvalid(true);
          return;
        }

        if (isDone) {
          callback();
        }
      })
    );
  };

  return {
    event,

    isLoading,
    isEditing,
    isScheduleValid,
    hasEventChanged,

    isDoneEnabled,
    isCoverInvalid,

    updateEventState,
    createOrUpdateEvent,
  };
};

export default useCreateEvent;

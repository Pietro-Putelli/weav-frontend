import { isEmpty, isNull } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventsAPI from "../backend/events";
import InsightsAPI from "../backend/insights";
import {
  getMyBusinessEventByIdState,
  getMyBusinessEventsState,
  updateBusinessEventDetails,
} from "../store/slices/eventsReducer";
import useCurrentBusiness from "./useCurrentBusiness";

const useMyBusinessEvents = ({ eventId, showInsights } = {}) => {
  const events = useSelector(getMyBusinessEventsState);

  const { isBusiness } = useCurrentBusiness();

  const event = useSelector((state) => {
    if (eventId) {
      return getMyBusinessEventByIdState(state, eventId);
    }

    return null;
  });

  const singleEventProps = useMemo(() => {
    if (event) {
      const slices = event?.slices ?? [];
      return {
        slices,
        lastIndex: slices.length - 1,
        insights: event?.insights,
      };
    }

    return {};
  }, [event]);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isBusiness) {
      return;
    }

    if (isEmpty(events)) {
      fetchEvents();
    }

    if (showInsights) {
      fetchInsights();
    }

    if (eventId && !event?.hasDetails) {
      fetchEventDetails();
    }
  }, []);

  const { hasLiveEvent } = useMemo(() => {
    let liveEvent = null;

    for (let event of events) {
      const dateTimeString = `${event.date} ${event.time}`;

      const mergedMoment = moment(
        dateTimeString,
        "YYYY-MM-DD HH:mm:ss"
      ).toDate();

      const currentDate = moment();

      if (currentDate.isAfter(mergedMoment)) {
        liveEvent = event;
        break;
      }
    }

    const hasLiveEvent = !isNull(liveEvent) && isBusiness;

    return { liveEvent, hasLiveEvent };
  }, [events, isBusiness]);

  const fetchInsights = (isRefreshing) => {
    setIsRefreshing(isRefreshing);

    dispatch(
      InsightsAPI.getEvent(eventId, () => {
        setIsRefreshing(false);
      })
    );
  };

  const fetchEvents = () => {
    setIsLoading(true);

    dispatch(
      EventsAPI.getBusinessEvents(() => {
        setIsLoading(false);
      })
    );
  };

  const fetchEventDetails = () => {
    setIsLoading(true);

    EventsAPI.getDetail(eventId, (data) => {
      if (data) {
        dispatch(updateBusinessEventDetails({ eventId, data }));
      }

      setIsLoading(false);
    });
  };

  const refreshInsights = () => {
    fetchInsights(true);
  };

  return {
    events,
    event,
    isLoading,
    isRefreshing,
    hasLiveEvent,
    refreshInsights,
    refrehsEvents: fetchEvents,
    ...singleEventProps,
  };
};

export default useMyBusinessEvents;

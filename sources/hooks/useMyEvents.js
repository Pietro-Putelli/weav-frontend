import { difference, isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventsAPI from "../backend/events";
import {
  getMyEventsState,
  setMyEventsState,
} from "../store/slices/eventsReducer";
import { setupUserPosition } from "../handlers/user";
import useWhenChangeLocation from "./useWhenChangeLocation";
import { MAX_EVENT_DISTANCE } from "../constants/constants";

const useMyEvents = () => {
  const events = useSelector(getMyEventsState);

  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isEventsEmpty = isEmpty(events);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEventsEmpty) {
      fetchEvents();
    }
  }, []);

  useWhenChangeLocation({ delta: MAX_EVENT_DISTANCE }, () => {
    /* Everytime the user moves of 50 meters, events are updated */
    fetchEvents();
  });

  const fetchEvents = () => {
    setIsLoading(true);

    EventsAPI.getMine({ offset: 0 }, ({ data }) => {
      if (data) {
        dispatch(setMyEventsState(data));
      }

      setIsNotFound(isEmpty(data));

      setIsLoading(false);
      setIsRefreshing(false);
    });
  };

  const refreshEvents = () => {
    setIsRefreshing(true);

    fetchEvents();
  };

  return {
    events,
    events,
    isLoading,
    isNotFound,
    isRefreshing,
    setIsNotFound,
    refreshEvents,
  };
};

export default useMyEvents;

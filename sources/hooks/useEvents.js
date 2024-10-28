import { isEmpty, isNull, isUndefined, size } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventsAPI from "../backend/events";
import { removeEventChat } from "../store/slices/chatsReducer";
import {
  addMyEventState,
  getEventByIdState,
  getEventsState,
  removeMyEventState,
  setEventDetailState,
  updateCachedEventsState,
} from "../store/slices/eventsReducer";
import useCurrentLocation from "./useCurrentLocation";

const useEvents = ({ eventId, onLeaveEvent } = {}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const [isCaching, setIsCaching] = useState(true);

  /* To track the position changing */
  const [isChanging, setIsChanging] = useState(false);

  if (!isUndefined(eventId)) {
    /* Used when you download an event that isn't in Event screen */

    const event = useSelector((state) => {
      return getEventByIdState(state, eventId);
    });

    useEffect(() => {
      if (event) {
        setIsLoading(false);
      }

      if (event?.has_detail) {
        return;
      }

      setIsLoading(true);

      const eventDoesNotExists = !event;

      EventsAPI.getDetail(eventId, (data) => {
        if (data) {
          if (eventDoesNotExists) {
            dispatch(updateCachedEventsState({ ...data, has_detail: true }));
          } else {
            dispatch(setEventDetailState({ data, eventId }));
          }
        }

        setIsLoading(false);
      });
    }, []);

    const goToEvent = (callback) => {
      dispatch(
        EventsAPI.userParticipate(eventId, (action) => {
          if (action == "remove") {
            dispatch(removeMyEventState(eventId));

            if (onLeaveEvent) {
              onLeaveEvent();
            } else {
              dispatch(removeEventChat(eventId));
            }
          } else {
            dispatch(addMyEventState(event));
          }

          callback?.(!isNull(action));
        })
      );
    };

    return { event, isLoading, goToEvent };
  }

  const events = useSelector(getEventsState);
  const isEmptyEvents = isEmpty(events);

  const cachedEvents = []; // useSelector(getCachedEvents);
  const isCacheEmpty = isEmpty(cachedEvents);

  /* Effects */

  useEffect(() => {
    if (!isCaching || isCacheEmpty) {
      setIsNotFound(isEmptyEvents);
    }
  }, [isEmptyEvents, isCaching]);

  const endLoading = (succ) => {
    setIsLoading(false);
    setIsRefreshing(false);

    if (succ) {
      setIsCaching(false);

      setTimeout(() => {
        setIsChanging(false);
      }, 500);
    } else {
      setIsCaching(true);
    }
  };

  useCurrentLocation(() => {
    setIsChanging(true);

    fetchEvents();
  }, []);

  const fetchEvents = (offset = 0) => {
    dispatch(EventsAPI.get(offset, endLoading));
  };

  const refreshEvents = () => {
    setIsRefreshing(true);
    fetchEvents();
  };

  return {
    events,
    fetchEvents,
    refreshEvents,
    isLoading,
    isRefreshing,
    isNotFound,
    isCaching,
    isChanging: isChanging && !isCaching,
  };
};

export default useEvents;

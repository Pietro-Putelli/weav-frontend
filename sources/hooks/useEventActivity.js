import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventActivitiesAPI from "../backend/eventActivities";
import { MatchStates } from "../constants";
import {
  getCurrentActivityEvent,
  getCurrentActivityEventParticipants,
  getCurrentEventUserMatch,
  getCurrentEventUserMatchState,
  setActivityEventMatch,
  setActivityEventMatchAcceptedAt,
  setActivityEventMatchState,
  setCurrentActivityEvent,
} from "../store/slices/eventActivitesReducer";
import { isNullOrUndefined } from "../utility/boolean";
import useCurrentBusiness from "./useCurrentBusiness";

const useEventActivity = () => {
  const { isBusiness } = useCurrentBusiness();

  const event = useSelector(getCurrentActivityEvent);

  const { participants, participantsCount } = useSelector(
    getCurrentActivityEventParticipants
  );

  const match = useSelector(getCurrentEventUserMatch);
  const matchState = useSelector(getCurrentEventUserMatchState);

  const eventId = event?.id;

  const hasOngoingEvent = !isNullOrUndefined(event);

  const isMatchStarted = useMemo(() => {
    if (
      matchState == MatchStates.New ||
      matchState == MatchStates.WaitingForMatch
    ) {
      return false;
    }

    return !isNullOrUndefined(match);
  }, [matchState, match]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedJoinEvent, setSelectedJoinEvent] = useState(event);

  const isEventLive = true;

  const dispatch = useDispatch();

  /* Effects */

  useEffect(() => {
    if (
      matchState == MatchStates.WaitigForAccept ||
      matchState == MatchStates.WaitingForMatch
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [matchState]);

  useEffect(() => {
    if (matchState == MatchStates.Completed && isLoading) {
      setIsLoading(false);
    }
  }, [matchState]);

  /* Props */

  const {
    isMatchWaitingForAccept,
    isMatchAccepted,
    isMatchOngoing,
    isMatchCompleted,
  } = useMemo(() => {
    return {
      isMatchWaitingForAccept: matchState == MatchStates.WaitigForAccept,
      isMatchAccepted: matchState == MatchStates.Accepted,
      isMatchOngoing: matchState == MatchStates.Ongoing,
      isMatchCompleted: matchState == MatchStates.Completed,
    };
  }, [matchState]);

  /* Methods */

  const joinEvent = (eventId) => {
    EventActivitiesAPI.handleMembership({ eventId, mode: "join" }, (event) => {
      dispatch(setCurrentActivityEvent(event));
    });
  };

  const leaveEvent = () => {
    EventActivitiesAPI.handleMembership({ eventId, mode: "leave" }, () => {
      dispatch(setCurrentActivityEvent(null));
    });
  };

  const startOrSkipCallback = (response) => {
    let matchState = response?.match_state;

    if (response) {
      if (matchState == undefined) {
        dispatch(setActivityEventMatch(response));

        matchState = MatchStates.WaitigForAccept;
      }

      dispatch(setActivityEventMatchState(matchState));
    }
  };

  const startMatch = () => {
    setIsLoading(true);

    if (isLoading) {
      return;
    }

    EventActivitiesAPI.createMatch(eventId, startOrSkipCallback);
  };

  const acceptMatch = () => {
    EventActivitiesAPI.acceptMatch({ matchId: match.id }, (response) => {
      const matchState = response?.match_state ?? MatchStates.Accepted;

      dispatch(setActivityEventMatchState(matchState));
      dispatch(setActivityEventMatchAcceptedAt());
    });
  };

  const skipMatch = () => {
    dispatch(setActivityEventMatchState(MatchStates.WaitingForMatch));

    /* Wait a while before matching again, just for design feedback purpose */

    EventActivitiesAPI.skipMatch({ matchId: match.id }, (response) => {
      setTimeout(() => {
        startOrSkipCallback(response);
      }, 1000);
    });
  };

  const completeMatch = (qrData, callback) => {
    const [matchId, matchToken] = qrData.split(":");

    EventActivitiesAPI.completeMatch({ matchId, matchToken }, (isValid) => {
      callback?.(isValid);
    });
  };

  return {
    event,
    hasOngoingEvent: !isBusiness && hasOngoingEvent,

    participants,
    participantsCount,

    match,
    matchProfile: match?.profile,
    matchState,

    joinEvent,
    leaveEvent,
    startMatch,
    acceptMatch,
    skipMatch,
    completeMatch,

    isMatchStarted,
    isMatchWaitingForAccept,
    isMatchAccepted,
    isMatchOngoing,
    isMatchCompleted,
    isLoading,

    isEventLive,

    selectedJoinEvent,
    setSelectedJoinEvent,
  };
};

export default useEventActivity;

import { unionBy } from "lodash";
import { useState } from "react";
import { getUserMomentParticipants } from "../backend/moments";
import useDelayedEffect from "./useDelayedEffect";
import { EventsAPI } from "../backend";

const useMomentParticipants = ({ eventId, momentId }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useDelayedEffect(
    50,
    () => {
      fetchUsers();
    },
    []
  );

  const callback = (response) => {
    const participants = response?.users ?? response;

    const newUsers = unionBy(users, participants, "id");

    setUsers(newUsers);

    setIsLoading(false);
  };

  const fetchUsers = (offset = 0) => {
    setIsLoading(true);

    if (momentId) {
      getUserMomentParticipants({ momentId, offset }, callback);
    } else {
      EventsAPI.getParticipants({ eventId, offset, limit: 8 }, callback);
    }
  };

  return { users, isLoading, fetchUsers };
};

export default useMomentParticipants;

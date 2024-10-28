import { unionBy } from "lodash";
import { useEffect, useState } from "react";
import EventsAPI from "../backend/events";
import querylimits from "../constants/querylimits";

const useEventParticipants = ({ eventId }) => {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const fetchUsers = (offset) => {
    setIsLoading(true);

    EventsAPI.getParticipants(
      { offset, eventId, limit: querylimits.SIXTEEN },
      (data) => {
        if (data) {
          setIsLoading(false);

          setUsers((users) => {
            return unionBy(users, data.users, "id");
          });
        }
      }
    );
  };

  return { users, isLoading, fetchUsers };
};

export default useEventParticipants;

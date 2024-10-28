import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentUsers } from "../backend/profile";
import {
  getRecentProfileStates,
  setRecents,
} from "../store/slices/profilesReducer";

const useRecentUsers = () => {
  const cachedUsers = useSelector(getRecentProfileStates);
  const [users, setUsers] = useState([]);
  const [initialUsers, setInitialUsers] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);

  const isUsersEmpty = _.isEmpty(cachedUsers);
  const [isLoading, setIsLoading] = useState(isUsersEmpty);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isUsersEmpty) {
      setTimeout(() => {
        fetchUsers({ value: "" });
      }, 100);
    } else {
      setUsers(cachedUsers);
      setInitialUsers(cachedUsers);
    }
  }, []);

  const fetchUsers = (params) => {
    const { value } = params;
    const isInitial = value == "";

    getRecentUsers(params, (data) => {
      if (isInitial) {
        dispatch(setRecents({ data, mode: "set" }));
        setInitialUsers(data);
      }

      setUsers(data);

      const _isNotFound = !data || _.isEmpty(data);
      setIsNotFound(_isNotFound);
      setIsLoading(false);
    });
  };

  return {
    users,
    initialUsers,
    isNotFound,
    isLoading,
    fetchUsers,
  };
};

export default useRecentUsers;

import { isEmpty, unionBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRecents, searchUsers } from "../backend/profile";
import { getRecentUsers } from "../store/slices/profilesReducer";
import useSearchFashion from "./useSearchFashion";

const useSearchUsers = ({ allowRecents, limit } = {}) => {
  const [users, setUsers] = useState([]);

  const recentUsers = useSelector(getRecentUsers);

  const [isLoadingMore, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const serarchText = useRef();
  const offset = useRef(0);
  const dispatch = useDispatch();

  /* Effects */

  useEffect(() => {
    if (allowRecents && isEmpty(recentUsers)) {
      fetchRecentUsers();
    }
  }, []);

  /* Methods */

  const getUsers = () => {
    const _offset = offset.current;
    const value = serarchText.current;

    if (value == "") {
      setUsers([]);
      setIsNotFound(false);
      return;
    }

    setIsLoading(true);

    searchUsers({ value, offset: _offset }, (data) => {
      if (data) {
        setIsNotFound(isEmpty(data));

        if (_offset == 0) {
          setUsers(data);
        } else {
          setUsers((users) => {
            return unionBy(users, data, "id");
          });
        }

        /* Because flatlist sucks */
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    });
  };

  /* Get users as placeholder when in search the text is "" */
  const fetchRecentUsers = () => {
    setIsLoading(true);

    dispatch(
      getUserRecents(() => {
        setIsLoading(false);
      })
    );
  };

  const onChange = ({ value }) => {
    serarchText.current = value;
    offset.current = 0;

    getUsers();
  };

  const onEndReached = () => {
    offset.current += limit;

    getUsers();
  };

  const { searchText: value, onChangeText } = useSearchFashion({ onChange });

  return {
    users,
    recentUsers,
    value,
    fetchUsers: getUsers,
    onChangeText,
    onEndReached,
    isLoadingMore,
    isNotFound,
  };
};

export default useSearchUsers;

import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { search_both_chats } from "../backend/chat";
import { get_chats_state } from "../store/slices/chatsReducer";

const useShareMomentUsers = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const myChats = useSelector(get_chats_state).map((chat) => {
    const receveir = chat?.receiver;
    if (receveir) {
      return receveir;
    }
    return _.pick(chat, ["id", "name", "cover"]);
  });

  useEffect(() => {
    setItems(myChats);
  }, []);

  const fetchItems = ({ value, offset = 0 }, callback) => {
    setIsLoading(true);

    if (value == "") {
      setItems(myChats);

      return;
    }

    search_both_chats({ value, offset }, (data) => {
      const { users, clubs } = JSON.parse(data);

      const mergedData = _.union(users, clubs);

      setIsLoading(false);

      setIsNotFound(_.isEmpty(mergedData));

      if (offset == 0) {
        setItems(mergedData);
      } else {
        setItems(_.unionBy(users, mergedData, "id"));
      }
    });
  };

  return {
    items,
    fetchItems,
    isLoading,
    isNotFound,
  };
};

export default useShareMomentUsers;

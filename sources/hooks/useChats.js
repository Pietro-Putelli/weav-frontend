import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessChats, getChats } from "../backend/chat";
import { getChatsState, setChats } from "../store/slices/chatsReducer";
import useCurrentBusiness from "./useCurrentBusiness";

const useChats = () => {
  /* States */

  const chats = useSelector(getChatsState);

  /* Utility hooks */

  const { isBusiness } = useCurrentBusiness();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isCaching, setIsCaching] = useState(true);

  /* Effects */

  useEffect(() => {
    fetchChats(0);
  }, [isBusiness]);

  useEffect(() => {
    if (!isNotFound) {
      setIsNotFound(!isEmpty(chats));
    }
  }, [chats]);

  /* Methods */

  const endLoading = (data) => {
    setIsCaching(false);
    setIsLoading(false);
    setIsNotFound(isEmpty(data));
  };

  const setDecryptedChats = (chats, offset) => {
    const mode = offset == 0 ? "set" : "append";

    dispatch(setChats({ data: chats, mode }));
  };

  let fetchChats = () => {};

  if (isBusiness) {
    fetchChats = (offset = 0) => {
      setIsLoading(true);

      getBusinessChats({ offset }, (data) => {
        setIsLoading(false);
        setIsRefreshing(false);

        if (data) {
          endLoading(data);

          const mode = offset == 0 ? "set" : "append";
          dispatch(setChats({ data, mode }));
        } else {
          setIsCaching(true);
        }
      });
    };
  } else {
    fetchChats = (offset = 0) => {
      setIsLoading(true);

      getChats(offset, (data) => {
        setIsLoading(false);
        setIsRefreshing(false);

        if (data) {
          const { chats } = data;

          endLoading(chats);
          setIsCaching(false);

          setDecryptedChats(chats, offset);
        } else {
          setIsCaching(true);
        }
      });
    };
  }

  const refreshChats = () => {
    setIsRefreshing(true);

    fetchChats(0);
  };

  return {
    chats,
    isLoading,
    isNotFound,
    isRefreshing,
    fetchChats,
    refreshChats,
  };
};

export default useChats;

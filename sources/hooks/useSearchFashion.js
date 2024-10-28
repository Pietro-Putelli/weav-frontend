import { useEffect, useRef, useState } from "react";

const useSearchFashion = ({ onChange, initialValue }) => {
  const typingTimeout = useRef(0);

  const [searchText, setSearchText] = useState(initialValue ?? null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchText == null) {
      return;
    }

    setIsLoading(true);

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      setIsLoading(false);

      onChange({ value: searchText });
    }, 200);
  }, [searchText]);

  return {
    searchText,
    onChangeText: setSearchText,
    isLoading,
    setIsLoading,
  };
};

export default useSearchFashion;

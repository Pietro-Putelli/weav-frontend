import { useSelector } from "react-redux";
import { getRecentSearch } from "../store/slices/utilityReducer";

const useRecentSearch = () => {
  const recents = useSelector(getRecentSearch);

  return { recents };
};

export default useRecentSearch;

import { removeChance } from "../store/slices/chanceReducer";
import { CHANCE_DOMAIN } from "./endpoints";
import { deleteWithAuth } from "./methods";

export const ignoreUserChance = (chanceId) => (dispatch) => {
  deleteWithAuth(CHANCE_DOMAIN, { id: chanceId })
    .then(() => {
      dispatch(removeChance());
    })
    .catch((error) => {
      console.log("[ignore-user-chance]", error);
    });
};

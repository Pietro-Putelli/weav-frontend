import { createSlice } from "@reduxjs/toolkit";
import _, { findIndex, unionBy, unionWith } from "lodash";
import {
  INITIAL_BUSINESS_REDUCER,
  INITIAL_EDIT_BUSINESS,
} from "../initialStates";

const discriminateByIdAndExperienceType = (obj1, obj2) => {
  return obj1.id == obj2.id && obj1.experience_type == obj2.experience_type;
};

const business = createSlice({
  name: "business",
  initialState: INITIAL_BUSINESS_REDUCER,
  reducers: {
    setBusinesses: (state, action) => {
      const payload = action.payload;

      if (payload == null) {
        state.businesses = [];
        return;
      }

      const { data, mode, experienceType } = payload;

      if (mode == "set") {
        const newBusinesses = data.map((business) => {
          return {
            ...business,
            experience_type: experienceType,
          };
        });

        const oldBusinesses = state.businesses.filter((business) => {
          return business.experience_type != experienceType;
        });

        state.businesses = unionWith(
          oldBusinesses,
          newBusinesses,
          discriminateByIdAndExperienceType
        );
      } else {
        const businesses = data.map((business) => {
          return {
            ...business,
            experience_type: experienceType,
          };
        });

        state.businesses = unionWith(
          state.businesses,
          businesses,
          discriminateByIdAndExperienceType
        );
      }
    },

    setFilteredBusinesses: (state, action) => {
      const payload = action.payload;

      if (payload == null) {
        state.filtered = [];
        return;
      }

      const { data, mode } = payload;

      if (mode == "set") {
        state.filtered = data;
      } else {
        state.filtered = unionBy(state.filtered, data, "id");
      }
    },

    /* Set business by Id, when you load the full business page */
    setBusinessById: (state, action) => {
      const newBusiness = action.payload;
      const businessId = newBusiness.id;

      const businesses = state.businesses;
      const cachedBusinesses = state.cached;
      const filteredBusinesses = state.filtered;

      /* Check to which array newBusiness belongs, and update with newBusiness data */

      let index = findIndex(businesses, ["id", businessId]);

      if (index != -1) {
        state.businesses[index] = {
          ...state.businesses[index],
          ...newBusiness,
        };

        return;
      }

      index = findIndex(filteredBusinesses, ["id", businessId]);

      if (index != -1) {
        state.filtered[index] = {
          ...state.filtered[index],
          ...newBusiness,
        };
        return;
      }

      index = findIndex(cachedBusinesses, ["id", businessId]);

      if (index != -1) {
        state.cached[index] = {
          ...state.cached[index],
          ...newBusiness,
        };
        return;
      }

      state.cached = unionBy(state.cached, [newBusiness], "id");
    },

    /* Clear business on dismiss, leave only the first 4 */
    clearBusinesses: (state, _) => {
      state.businesses = [];
    },

    setCurrentBusiness: (state, action) => {
      let newBusiness = action.payload;

      if (newBusiness == null) {
        state.currentBusiness = null;
      } else {
        if (newBusiness.auth_token == null) {
          delete newBusiness.auth_token;
        }

        state.currentBusiness = {
          ...state.currentBusiness,
          ...newBusiness,
        };
      }
    },

    setCachedBusiness: (state, action) => {
      state.cached = _.unionBy(state.cached, [action.payload], "id");
    },

    handleLikeBusinessState: (state, action) => {
      const id = action.payload;

      let index = _.findIndex(state.businesses, ["id", id]);

      if (index != -1) {
        const business = state.businesses[index];
        const me = business.me;
        const liked = !me.liked;

        state.businesses[index] = {
          ...business,
          likes: business.likes + (liked ? 1 : -1),
          me: { ...me, liked },
        };
      }

      index = _.findIndex(state.cached, ["id", id]);

      if (index != -1) {
        const business = state.cached[index];
        const me = business.me;
        const liked = !me.liked;

        state.cached[index] = {
          ...business,
          likes: business.likes + (liked ? 1 : -1),
          me: { ...me, liked },
        };
      }
    },

    setRankedBusinesses: (state, action) => {
      state.ranked = _.unionBy(action.payload, data, "id");
    },

    setBusinessFeatures: (state, action) => {
      const { data, mode } = action.payload;

      if (mode == "both") {
        const { categories, amenities } = data;

        state.categories = categories;
        state.amenities = amenities;
      }

      if (mode == "categories") {
        state.categories = data.categories;
      }

      if (mode == "amenities") {
        state.amenities = data.amenities;
      }
    },

    setMyBusinesses: (state, action) => {
      state.myBusinesses = action.payload;
    },

    setEditBusiness: (state, action) => {
      if (action.payload == null) {
        state.editBusiness = INITIAL_EDIT_BUSINESS;
      } else {
        state.editBusiness = {
          ...state.editBusiness,
          ...action.payload,
        };
      }
    },

    addRepostToBusiness: (state, action) => {
      const businessId = action.payload;

      const businesses = unionBy(
        state.businesses,
        state.cached,
        state.filtered,
        "id"
      );

      const index = findIndex(businesses, ["id", businessId]);

      if (index != -1) {
        businesses[index].reposts_count += 1;
      }
    },

    clearBusinessState: (state, _) => {
      state.businesses = [];
      state.filtered = [];
      state.cached = [];
      state.currentBusiness = null;
      state.ranked = [];
      state.categories = [];
      state.amenities = [];
      state.myBusinesses = [];
      state.editBusiness = INITIAL_EDIT_BUSINESS;
    },
  },
});

export const {
  setBusinesses,
  clearBusinesses,
  setBusinessById,
  setFilteredBusinesses,

  addRepostToBusiness,

  setCurrentBusiness,
  setCachedBusiness,
  setBusinessFeatures,
  setRankedBusinesses,
  handleLikeBusinessState,

  setMyBusinesses,
  setEditBusiness,
  clearBusinessState,
} = business.actions;

export const getBusinessesByExperienceTypeState = (state, experienceType) => {
  const businessState = state.business.businesses;

  return businessState.filter((business) => {
    return business.experience_type == experienceType;
  });
};

export const getFilteredBusinessesState = (state) => {
  return state.business.filtered;
};

export const getBusinessByIdState = (state, id) => {
  const businessState = state.business;

  const businesses = _.union(
    businessState.businesses,
    businessState.filtered,
    businessState.cached
  );

  return _.find(businesses, ["id", id]);
};

export const getCurrentBusiness = (state) => {
  return state.business.currentBusiness;
};

export const getRankedBusinesses = (state, category) => {
  return state.business.ranked.filter((business) => {
    return business.category.id == category.id;
  });
};

export const getBusinessFeaturesState = (state, mode) => {
  const businessState = state.business;

  let categories = [];
  let amenities = [];

  if (mode == "both") {
    categories = businessState.categories ?? [];
    amenities = businessState.amenities ?? [];
  }

  if (mode == "categories") {
    categories = businessState.categories;
  }

  if (mode == "amenities") {
    amenities = businessState.amenities;
  }

  return {
    categories,
    amenities,
  };
};

export const getMyBusinessesState = (state) => {
  return state.business.myBusinesses;
};

export const getEditBusiness = (state) => {
  return state.business.editBusiness;
};

export default business.reducer;

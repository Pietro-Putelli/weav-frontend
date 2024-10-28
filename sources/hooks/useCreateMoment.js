import {
  isEmpty,
  isEqual,
  isNull,
  isUndefined,
  pick,
  pickBy,
  unionBy,
} from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { formatUserMoment } from "../backend/formatters/momentFormatters";
import { createUserMoment } from "../backend/moments";
import {
  MAX_EMOJIS_PER_MOMENT,
  MIN_USER_MOMENT_CHAR_COUNT,
} from "../constants/constants";
import { INITIAL_USER_MOMENT } from "../store/initialStates";

import {
  setMomentsState,
  setMyMomentsState,
} from "../store/slices/momentsReducer";

import { Analytics, analyticTypes } from "../analytics";
import { isNullOrUndefined } from "../utility/boolean";
import { countEmojis } from "../utility/functions";
import { characterCountWithoutSpaces } from "../utility/strings";
import { addRepostToEvent } from "../store/slices/eventsReducer";
import { addRepostToBusiness } from "../store/slices/businessesReducer";

/*
    Use this hook inside the screen for creating moments,
    Redux myMoment is the temporary store for the creation.
*/

const useCreateMoment = ({ initialMoment }) => {
  const [moment, setMoment] = useState();
  const [isLoading, setIsLoading] = useState();

  const doesInitialMomentExists = !isUndefined(initialMoment);

  const dispatch = useDispatch();

  /* Methods */

  const getActiveWidgets = (moment) => {
    const {
      source,
      uri,
      business_tag,
      url_tag,
      location_tag,
      participants,
      cover,
    } = moment ?? {};

    return {
      url_tag: url_tag != null,
      business_tag: business_tag != null,
      location_tag: location_tag != null,
      source: source != null || !isUndefined(cover) || !isUndefined(uri),
      participants: !isEmpty(participants),
    };
  };

  const flushMomentState = () => {
    setMoment(INITIAL_USER_MOMENT);
  };

  const updateMomentState = (state) => {
    setMoment((moment) => {
      return { ...moment, ...state };
    });
  };

  /* CREATE USER MOMENT */

  const [mentionedUsername, setMentionedUsername] = useState();
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [isSourceInvalid, setIsSourceInvalid] = useState(false);

  const momentParticipants = moment?.participants || [];

  /* Effects */

  useEffect(() => {
    if (doesInitialMomentExists) {
      updateMomentState({ ...initialMoment, duration: 60 * 4 });
    } else {
      flushMomentState();
    }
  }, []);

  useEffect(() => {
    if (isSourceInvalid) {
      setIsSourceInvalid(false);
    }
  }, [moment?.source]);

  /* Props */

  const doesMomentExists = useMemo(() => {
    const isMomentNull = isNull(moment);

    const isMomentSameAsInitial = isEqual(moment, INITIAL_USER_MOMENT);

    const isMomentEmpty =
      Object.keys(
        pickBy(moment, (key) => {
          return !isNullOrUndefined(key);
        })
      ).length == 0;

    return !isMomentNull && !isMomentSameAsInitial && !isMomentEmpty;
  }, [moment]);

  const activeWidgets = useMemo(() => {
    return getActiveWidgets(moment);
  }, [moment]);

  const isDoneEnabled = useMemo(() => {
    const content = moment?.content;

    const validText =
      !isUndefined(content) &&
      !isEmpty(content) &&
      characterCountWithoutSpaces(content) > MIN_USER_MOMENT_CHAR_COUNT;

    const validSource = !isNullOrUndefined(moment?.source);
    const hasVenue = !isNullOrUndefined(moment?.business_tag);

    const validEmoji = countEmojis(content) <= MAX_EMOJIS_PER_MOMENT;

    if (validText) {
      return validEmoji;
    }

    return validSource || (validText && hasVenue);
  }, [moment]);

  const createMoment = async (callback) => {
    setIsLoading(true);

    const participants = unionBy(momentParticipants, taggedUsers, "id");

    const data = await formatUserMoment({ moment, participants });

    createUserMoment(
      data,
      (moment) => {
        if (moment) {
          callback?.(moment);

          dispatch(setMyMomentsState({ moment }));
          dispatch(setMomentsState({ data: moment, mode: "append-before" }));

          const { business_tag, event } = moment;

          if (business_tag) {
            dispatch(addRepostToBusiness(business_tag.id));
          }

          if (event) {
            dispatch(addRepostToEvent(event.id));
          }

          /* Send to firebase the success */
          Analytics.sendEvent(analyticTypes.END_MOMENT_CREATE);
        } else {
          callback?.(null);
        }
      },
      () => {
        setIsLoading(false);
        setIsSourceInvalid(true);
      }
    );
  };

  const removeTag = (tag) => {
    updateMomentState({ [tag?.type ?? tag]: null });
  };

  /* Callbacks */

  const onChangeText = (content) => {
    updateMomentState({ content });

    if (isEmpty(content)) {
      setTaggedUsers([]);
    }
  };

  const onMentioningChangeText = (value, parts) => {
    updateMomentState({ parts });
    setMentionedUsername(value);
  };

  const onPickedWidget = ({ item, type }) => {
    if (type == "source") {
      const source = pick(item, ["uri", "width", "height"]);
      updateMomentState({ source });
    } else {
      updateMomentState({ [type]: item });
    }
  };

  const onUserTagSelected = ({ value, user }) => {
    setTaggedUsers(unionBy(taggedUsers, [user], "id"));

    onChangeText(value);
    setMentionedUsername(null);
  };

  const onDurationChanged = (duration) => {
    updateMomentState({ duration });
  };

  const onParticipantsChanged = (participants) => {
    updateMomentState({ participants });
  };

  return {
    moment,
    activeWidgets,
    doesMomentExists,
    mentionedUsername,

    isDoneEnabled: isDoneEnabled && !isSourceInvalid,
    isSourceInvalid,
    isLoading,

    participants: momentParticipants,

    removeTag,
    createMoment,

    onPickedWidget,
    onChangeText,
    onMentioningChangeText,
    onUserTagSelected,
    onDurationChanged,
    onParticipantsChanged,
  };
};

export default useCreateMoment;

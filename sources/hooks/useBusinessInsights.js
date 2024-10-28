import { isEqual, isNull, pick } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InsightsAPI, {
  getInsightsDetail,
  getInsightsOverview,
} from "../backend/insights";
import {
  getInsightDateInitialValue,
  getPreviousPeriod,
} from "../components/calendar/utils";
import { insights } from "../constants";
import {
  flushInsights,
  getInsightsDetailState,
  getInsightsOverviewState,
  getInsightsPeriod,
  setInsightPeriod,
  setInsightsForType,
  setInsightsOverview,
} from "../store/slices/insightsReducer";
import useLanguages from "./useLanguages";

const { INSIGHT_TYPES } = insights;

const useBusinessInsights = ({ type, isOverview } = {}) => {
  const insightsPeriod = useSelector(getInsightsPeriod);
  const insightsOverview = useSelector(getInsightsOverviewState);

  const selectedInsight = useSelector((state) => {
    return getInsightsDetailState(state, type);
  });

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentInsight, setCurrentInsight] = useState(null);
  const [prevPeriod, setPrevPeriod] = useState(insightsPeriod);

  const overviewDoesNotExists = isNull(insightsOverview);
  const selectedInsightDoesNotExists = isNull(selectedInsight);

  const isCurrentInsightValid = !isNull(currentInsight);

  const { languageContent } = useLanguages();

  /* Effects */

  useEffect(() => {
    if (type) {
      if (selectedInsightDoesNotExists) {
        fetchInsights();
      } else {
        setCurrentInsight(selectedInsight);
      }
    }

    if (isOverview && isPeriodInvalid) {
      const last7Days = getInsightDateInitialValue(languageContent);
      dispatch(setInsightPeriod(last7Days));
    }
  }, []);

  useEffect(() => {
    if (
      isOverview &&
      !isPeriodInvalid &&
      (hasPeriodChanged || overviewDoesNotExists)
    ) {
      setPrevPeriod(insightsPeriod);

      dispatch(flushInsights());

      fetchOverviewInsights();
    }
  }, [insightsPeriod, hasPeriodChanged]);

  /* Props */

  const hasPeriodChanged = useMemo(() => {
    return !isEqual(prevPeriod, insightsPeriod);
  }, [insightsPeriod, prevPeriod]);

  const isPeriodInvalid = useMemo(() => {
    const { from, to } = insightsPeriod;

    return from == "" || to == "";
  }, [insightsPeriod]);

  const formattedDate = useMemo(() => {
    return {
      from: moment(insightsPeriod.from),
      to: moment(insightsPeriod.to),
    };
  }, []);

  /* Format values for chart */

  const formattedValues = useMemo(() => {
    if (!isCurrentInsightValid || !currentInsight?.values) {
      return [];
    }

    const reducedValues = reduceValues(currentInsight.values);

    return reducedValues.map((value) => {
      if (value < 1) {
        return 0.0001;
      }
      return value;
    });
  }, [currentInsight]);

  /* Total of values in LineChart */

  const valuesTotal = useMemo(() => {
    if (!isCurrentInsightValid || !currentInsight?.values) {
      return 0;
    }

    return currentInsight.values.reduce((partialSum, a) => partialSum + a, 0);
  }, [currentInsight]);

  /* Handle summary total interactions */

  const interactionsCount = useMemo(() => {
    if (!isCurrentInsightValid || !currentInsight?.interactions) {
      return 0;
    }

    return currentInsight.interactions.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
  }, [currentInsight]);

  const summaryInteractionValues = useMemo(() => {
    if (!isCurrentInsightValid || !currentInsight?.interactions) {
      return [];
    }

    const reducedValues = reduceValues(currentInsight.interactions);

    return reducedValues.map((value) => {
      if (value < 1) {
        return 0.0001;
      }
      return value;
    });
  }, [currentInsight]);

  /* Use to know if the insight exists */

  const isValidInsight = useMemo(() => {
    if (type != INSIGHT_TYPES.summary) {
      return valuesTotal != 0 && !isLoading && !isNull(currentInsight);
    }

    if (isCurrentInsightValid) {
      const { reposts_count, shares_count, likes_count } = currentInsight;

      return reposts_count > 0 || shares_count > 0 || likes_count > 0;
    }

    return false;
  }, [valuesTotal, isLoading, currentInsight, isCurrentInsightValid]);

  /* Methods */

  const endCallback = () => {
    setIsLoading(false);
    setIsRefreshing(false);
  };

  const fetchOverviewInsights = () => {
    setIsLoading(true);

    const { from, to } = insightsPeriod;
    const { from: prevFrom, to: prevTo } = getPreviousPeriod(from, to);

    const periods = { from, to, prev_from: prevFrom, prev_to: prevTo };

    InsightsAPI.getOverview(periods, (overview) => {
      if (overview) {
        endCallback();

        dispatch(setInsightsOverview(overview));
      }
    });
  };

  const fetchInsights = () => {
    setIsLoading(true);

    const params = pick(insightsPeriod, ["from", "to"]);

    InsightsAPI.getDetails({ type, ...params }, (insights) => {
      if (insights) {
        endCallback();

        dispatch(setInsightsForType({ type, insights }));

        setCurrentInsight(insights);
      }
    });
  };

  const refreshOverview = () => {
    setIsRefreshing(true);

    fetchOverviewInsights();

    dispatch(flushInsights());
  };

  /* Callbacks */

  const onChangeInsightsPeriod = ({ from, to, title, type }) => {
    dispatch(setInsightPeriod({ from, to, title, type }));
  };

  const insight = useMemo(() => {
    if (type == INSIGHT_TYPES.summary) {
      return {
        ...currentInsight,
        interactions: summaryInteractionValues,
        interactions_count: interactionsCount,
      };
    }

    return {
      ...currentInsight,
      values: formattedValues,
      values_total: valuesTotal,
    };
  }, [
    currentInsight,
    formattedValues,
    valuesTotal,
    summaryInteractionValues,
    interactionsCount,
    type,
  ]);

  return {
    insightsPeriod,
    datePeriod: formattedDate,
    onChangeInsightsPeriod,

    isLoading,
    isRefreshing,
    isValidInsight,

    insightsOverview,
    overviewDoesNotExists,
    refreshOverview,

    insight,
  };
};

export default useBusinessInsights;

/* Max of 15 (MAX_VALUES + MAX_VALUES / 2) dots show in the chart */

const MAX_VALUES = 8;

const reduceValues = (values) => {
  const valuesLength = values.length;
  const step = Math.max(1, Math.round(valuesLength / MAX_VALUES));

  if (step == 1) {
    return values;
  }

  let newValues = [];
  let tempSum = 0;

  values.forEach((value, index) => {
    tempSum += value;

    if (index != 0 && (index - (step - 1)) % step == 0) {
      newValues.push(tempSum);
      tempSum = 0;
    }
  });

  if (valuesLength % 2 != 0) {
    newValues.push(values[valuesLength - 1]);
  }

  return newValues;
};

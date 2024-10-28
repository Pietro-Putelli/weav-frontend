import { icons } from "../styles";

const INSIGHT_TYPES = {
  reposts: "reposts",
  shares: "shares",
  likes: "likes",
  visits: "visits",
  summary: "summary",
};

const INSIGHT_ACTIONS = [
  {
    icon: icons.Repost,
    type: INSIGHT_TYPES.reposts,
    contentKey: "delta_reposts",
  },
  {
    icon: icons.ShareEmpty,
    type: INSIGHT_TYPES.shares,
    contentKey: "delta_shares",
  },
  {
    icon: icons.LikeEmpty,
    type: INSIGHT_TYPES.likes,
    contentKey: "delta_likes",
  },
  {
    icon: icons.EyeShow,
    type: INSIGHT_TYPES.visits,
    contentKey: "delta_visits",
  },
  {
    icon: icons.Insight,
    type: INSIGHT_TYPES.summary,
  },
];

const insights = { INSIGHT_TYPES, INSIGHT_ACTIONS };

export default insights;

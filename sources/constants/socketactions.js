const socketactions = {
  MESSAGE: "message",

  CHAT_DOES_NOT_EXIST: "chat_does_not_exist",

  /* Feeds such as moments mention count or friend requests count */
  USER_MENTION_MOMENT: "user_mention_moment",
  USER_FRIEND_REQUEST: "user_friend_request",
  USER_SPOT_REPLIES: "user_spot_replies",

  /* Used to get the updated chat / chats */
  CHAT: "chat",

  /* Used to align user frontend and backend */
  ALIGN_USER: "align_user",

  MATCH_CREATED: "match_created",
  MATCH_ONGOING: "match_ongoing",
  MATCH_REJECTED: "match_rejected",
  MATCH_COMPLETED: "match_completed",
};

export default socketactions;

const ICON_PATH = "../assets/icons";

const icons = {
  tabs: [
    require(`${ICON_PATH}/play.png`),
    require(`${ICON_PATH}/cocktail.png`),
    require(`${ICON_PATH}/paperplane.png`),
  ],
  Chevrons: {
    Left: require(`${ICON_PATH}/left.png`),
    Right: require(`${ICON_PATH}/right.png`),
    Down: require(`${ICON_PATH}/down.png`),
    Up: require(`${ICON_PATH}/up.png`),
  },

  Arrows: {
    Left: require(`${ICON_PATH}/arrow.left.png`),
    Right: require(`${ICON_PATH}/arrow.right.png`),
  },

  EyeShow: require(`${ICON_PATH}/eye.show.png`),
  EyeHide: require(`${ICON_PATH}/eye.hide.png`),

  LikeEmpty: require(`${ICON_PATH}/heart.empty.png`),
  LikeFill: require(`${ICON_PATH}/heart.fill.png`),

  /* CAMERA */

  Camera: require(`${ICON_PATH}/camera.png`),
  FlashOn: require(`${ICON_PATH}/flash.on.png`),
  FlashOff: require(`${ICON_PATH}/flash.off.png`),
  FlipCamera: require(`${ICON_PATH}/flipcamera.png`),
  Play: require(`${ICON_PATH}/play.png`),
  Library: require(`${ICON_PATH}/library.png`),
  Logout: require(`${ICON_PATH}/logout.png`),
  Ranking: require(`${ICON_PATH}/rank.png`),

  Insight: require(`${ICON_PATH}/insight.png`),
  Ticket: require(`${ICON_PATH}/ticket.png`),
  Explore: require(`${ICON_PATH}/explore.png`),
  Change: require(`${ICON_PATH}/change.png`),
  Feed: require(`${ICON_PATH}/feed.png`),
  More: require(`${ICON_PATH}/more.png`),
  Paperplane: require(`${ICON_PATH}/paperplane.png`),
  Search: require(`${ICON_PATH}/search.png`),
  Block: require(`${ICON_PATH}/block.png`),
  Verified: require(`${ICON_PATH}/verified.png`),
  Clock: require(`${ICON_PATH}/clock.png`),
  Selected: require(`${ICON_PATH}/selected.png`),
  Profits: require(`${ICON_PATH}/profits.png`),
  Price: require(`${ICON_PATH}/money.png`),
  Question: require(`${ICON_PATH}/question.mark.png`),
  ShareOutside: require(`${ICON_PATH}/share.outside.png`),
  Archive: require(`${ICON_PATH}/archive.png`),
  Tips: require(`${ICON_PATH}/tips.png`),
  CircleCross: require(`${ICON_PATH}/circle.cross.png`),
  VenueMenu: require(`${ICON_PATH}/venue.menu.png`),
  Closed: require(`${ICON_PATH}/closed.png`),
  Idea: require(`${ICON_PATH}/idea.png`),
  Wallet: require(`${ICON_PATH}/wallet.png`),
  Bow: require(`${ICON_PATH}/spot.png`),

  Bin: require(`${ICON_PATH}/bin.png`),
  MyLocation: require(`${ICON_PATH}/my.location.png`),
  Cocktail: require(`${ICON_PATH}/cocktail.png`),
  Edit: require(`${ICON_PATH}/edit.png`),

  Paste: require(`${ICON_PATH}/paste.png`),
  Copy: require(`${ICON_PATH}/copy.png`),
  Done: require(`${ICON_PATH}/done.png`),
  Cross: require(`${ICON_PATH}/cross.png`),
  Link: require(`${ICON_PATH}/link.png`),
  Phone: require(`${ICON_PATH}/phone.png`),
  Share: require(`${ICON_PATH}/share.png`),
  ShareEmpty: require(`${ICON_PATH}/share.empty.png`),
  Languages: require(`${ICON_PATH}/languages.png`),

  Instagram: require(`${ICON_PATH}/instagram.png`),
  Menu: require(`${ICON_PATH}/menu.png`),
  Add: require(`${ICON_PATH}/add.png`),

  At: require(`${ICON_PATH}/at.png`),
  Reply: require(`${ICON_PATH}/reply.png`),
  Flag: require(`${ICON_PATH}/flag.png`),

  Tag: require(`${ICON_PATH}/tag.png`),
  Privacy: require(`${ICON_PATH}/privacy.png`),
  Settings: require(`${ICON_PATH}/settings.png`),
  Dollar: require(`${ICON_PATH}/dollar.png`),
  Favourite: require(`${ICON_PATH}/favourite.png`),
  Sorting: require(`${ICON_PATH}/sorting.png`),
  Leave: require(`${ICON_PATH}/leave.png`),
  Permissions: require(`${ICON_PATH}/permissions.png`),
  CircleCheck: require(`${ICON_PATH}/circle.check.png`),
  Info: require(`${ICON_PATH}/info.png`),
  SeenMessage: require(`${ICON_PATH}/seen.message.png`),
  Items: require(`${ICON_PATH}/items.png`),
  Chance: require(`${ICON_PATH}/chance.png`),
  Terms: require(`${ICON_PATH}/terms.png`),

  NotificationOn: require(`${ICON_PATH}/notification.on.png`),
  NotificationOff: require(`${ICON_PATH}/notification.off.png`),
  NotificationOffFill: require(`${ICON_PATH}/notification.off.fill.png`),

  Marker: require(`${ICON_PATH}/marker.png`),
  Marker1: require(`${ICON_PATH}/marker1.png`),
  Marker2: require(`${ICON_PATH}/marker2.png`),
  Near: require(`${ICON_PATH}/near.png`),
  Directions: require(`${ICON_PATH}/directions.png`),
  Repost: require(`${ICON_PATH}/repost.png`),
  Calendar: require(`${ICON_PATH}/calendar.png`),
  Guest: require(`${ICON_PATH}/guest.png`),
  Going: require(`${ICON_PATH}/going.png`),
  Conversation: require(`${ICON_PATH}/conversation.png`),
  Friends: require(`${ICON_PATH}/friends.png`),
  AddFriend: require(`${ICON_PATH}/add.friends.png`),
  Anonymous: require(`${ICON_PATH}/anonymous.png`),
  QrCode: require(`${ICON_PATH}/qrcode.png`),
  Gear: require(`${ICON_PATH}/gear_empty.png`),

  VenueTypes: {
    0: require(`${ICON_PATH}/popular.png`),
    1: require(`${ICON_PATH}/eat.png`),
    2: require(`${ICON_PATH}/aperitif.png`),
    3: require(`${ICON_PATH}/coffee.png`),
    4: require(`${ICON_PATH}/night.club.png`),
  },

  AppIcon: require(`${ICON_PATH}/app.icon.png`),
  Apple: require(`${ICON_PATH}/login_apple.png`),
  Google: require(`${ICON_PATH}/login_google.png`),

  // COLORED

  ColoredCocktail: require(`${ICON_PATH}/colored.cocktail.png`),
  ColoredMenu: require(`${ICON_PATH}/colored.menu.png`),
  ColoredLink: require(`${ICON_PATH}/colored.link.png`),
  ColoredInstagram: require(`${ICON_PATH}/colored.instagram.png`),
  ColoredMap: require(`${ICON_PATH}/colored.map.png`),
  ColoredPhone: require(`${ICON_PATH}/colored.phone.png`),
  ColoredDestination: require(`${ICON_PATH}/colored.destination.png`),
  ColoredClock: require(`${ICON_PATH}/colored.clock.png`),
  ColoredMarker: require(`${ICON_PATH}/colored.marker.png`),
  ColoredTickets: require(`${ICON_PATH}/colored.tickets.png`),
  ColoredChat: require(`${ICON_PATH}/colored.chat.png`),
  ColoredCamera: require(`${ICON_PATH}/colored.camera.png`),
  ColoredWarning: require(`${ICON_PATH}/colored.warning.png`),
  ColoredCalendar: require(`${ICON_PATH}/colored.calendar.png`),
  ColoredChance: require(`${ICON_PATH}/colored.chance.png`),
  ColoredFriends: require(`${ICON_PATH}/colored.friends.png`),
  ColoredBar: require(`${ICON_PATH}/colored.bar.png`),
  ColoredEmail: require(`${ICON_PATH}/colored.email.png`),
  ColoredChart: require(`${ICON_PATH}/colored.chart.png`),
  ColoredNotifications: require(`${ICON_PATH}/colored.notifications.png`),
  ColoredBusiness: require(`${ICON_PATH}/colored.business.png`),
  ColoredEvent: require(`${ICON_PATH}/colored.event.png`),
  ColoredSpots: require(`${ICON_PATH}/colored.spots.png`),
  ColoredAnonymous: require(`${ICON_PATH}/colored.anonymous.png`),

  MediaLibrary: require(`${ICON_PATH}/media.library.png`),

  Whatsapp: require(`${ICON_PATH}/whatsapp.png`),
  Telegram: require(`${ICON_PATH}/telegram.png`),

  Flags: {
    it: require(`${ICON_PATH}/it.flag.png`),
    en: require(`${ICON_PATH}/en.flag.png`),
  },

  Glovo: require(`${ICON_PATH}/glovo.png`),
  Deliveroo: require(`${ICON_PATH}/deliveroo.png`),
  Ubereats: require(`${ICON_PATH}/ubereats.png`),
  Justeat: require(`${ICON_PATH}/justeat.png`),
};

export default icons;

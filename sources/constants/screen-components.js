import {
  AddBusinessModal,
  AddLinkModal,
  AddLocationModal,
  AddParticipantsModal,
  BusinessAcceptTermsModal,
  BusinessShareModal,
  CalendarModal,
  ChangeProfilePictureModal,
  ChooseBusinessToCreateModal,
  ContactUsModal,
  CountryPickerModal,
  CustomVenueFeatureModal,
  DateTimePickerModal,
  DeleteVenueModal,
  EditAddressModal,
  EditBioModal,
  EditBusinessModal,
  EditInstagramModal,
  EditLinkModal,
  EditNameModal,
  EditPhoneModal,
  EditUsernameModal,
  EventParticipantsModal,
  InsightInfoModal,
  InviteFriendsModal,
  LanguagesModal,
  MapSelectorModal,
  MenuModal,
  MomentFiltersModal,
  MomentParticipantsModal,
  MyMomentDetailsModal,
  MyProfilesListModal,
  ProfileStuffsModal,
  ReactionModal,
  ReportModal,
  ReserveOptionsModal,
  ShareModal,
  SleekLoginModal,
  TutorialModal,
  VenueDescriptionModal,
  VenueFiltersModal,
  VenueMapModal,
  VenueTimetableModal,
} from "../modals";

import {
  BusinessDetailScreen,
  BusinessEventPreviewScreen,
  BusinessInsightDetailScreen,
  BusinessInsightsScreen,
  BusinessListScreen,
  BusinessMomentsScreen,
  BusinessPostsScreen,
  BusinessProfileScreen,
  BusinessRankingScreen,
  BusinessSpotsScreen,
  CameraScreen,
  ChatMessageScreen,
  ChatScreen,
  CreateEventScreen,
  CreateMomentScreen,
  CreateSpotScreen,
  EditBusinessPostScreen,
  EditBusinessScreen,
  EditLocationMapScreen,
  EditProfileScreen,
  EditUserPostScreen,
  EventDetailScreen,
  EventUsersListScreen,
  HomeScreen,
  MapScreen,
  MomentPreviewScreen,
  MomentsListScreen,
  MyEventsScreen,
  MyMomentsScreen,
  NameScreen,
  PhoneLoginScreen,
  PhoneVerificationScreen,
  PhotoCropScreen,
  ProfilePictureLoginScreen,
  ProfileScreen,
  QrScannerScreen,
  SearchScreen,
  SettingsScreen,
  SortPostSliceScreen,
  SpotRepliesScreen,
  SpotsScreen,
  UserEventsScreen,
  UserFeedScreen,
  UserMomentsScreen,
  UsernameScreen,
  UserPostsScreen,
  UserSearchScreen,
  VenueScreen,
  WebViewScreen,
} from "../screens";

import { SCREENS } from "./screens";

export const SCREEN_COMPONENTS = {
  TABS: [
    { name: SCREENS.Home, component: HomeScreen },
    { name: SCREENS.Venue, component: VenueScreen },
    { name: SCREENS.Chat, component: ChatScreen },
    { name: SCREENS.Profile, component: ProfileScreen },
    {
      name: SCREENS.BusinessProfile,
      component: BusinessProfileScreen,
    },
  ],

  /* First screen has been registred apart */
  LOGIN: [
    {
      name: SCREENS.PhoneLogin,
      component: PhoneLoginScreen,
    },
    {
      name: SCREENS.Username,
      component: UsernameScreen,
    },
    {
      name: SCREENS.PhoneVerification,
      component: PhoneVerificationScreen,
    },
    {
      name: SCREENS.Name,
      component: NameScreen,
    },
    {
      name: SCREENS.ProfilePictureLogin,
      component: ProfilePictureLoginScreen,
    },
    {
      name: SCREENS.BusinessMoments,
      component: BusinessMomentsScreen,
    },
  ],

  STACK: [
    {
      name: SCREENS.VenueDetail,
      component: BusinessDetailScreen,
    },
    {
      name: SCREENS.UserPosts,
      component: UserPostsScreen,
    },
    {
      name: SCREENS.Search,
      component: SearchScreen,
    },
    {
      name: SCREENS.UserFeed,
      component: UserFeedScreen,
    },
    {
      name: SCREENS.EditProfile,
      component: EditProfileScreen,
    },
    {
      name: SCREENS.PhotoCrop,
      component: PhotoCropScreen,
    },
    {
      name: SCREENS.Settings,
      component: SettingsScreen,
    },
    {
      name: SCREENS.EditUserPost,
      component: EditUserPostScreen,
    },
    {
      name: SCREENS.EditBusinessPost,
      component: EditBusinessPostScreen,
    },
    {
      name: SCREENS.SortSlices,
      component: SortPostSliceScreen,
    },
    {
      name: SCREENS.Camera,
      component: CameraScreen,
    },
    {
      name: SCREENS.EditBusiness,
      component: EditBusinessScreen,
    },
    {
      name: SCREENS.BusinessInsight,
      component: BusinessInsightsScreen,
    },
    {
      name: SCREENS.BusinessInsightDetail,
      component: BusinessInsightDetailScreen,
    },
    {
      name: SCREENS.ChatMessage,
      component: ChatMessageScreen,
    },
    {
      name: SCREENS.VenueRanking,
      component: BusinessRankingScreen,
    },
    {
      name: SCREENS.Map,
      component: MapScreen,
    },
    {
      name: SCREENS.BusinessList,
      component: BusinessListScreen,
    },
    {
      name: SCREENS.MyMomentDetails,
      component: MyMomentDetailsModal,
    },
    {
      name: SCREENS.MyMoments,
      component: MyMomentsScreen,
    },
    {
      name: SCREENS.BusinessPosts,
      component: BusinessPostsScreen,
    },
    {
      name: SCREENS.MomentsList,
      component: MomentsListScreen,
    },
    {
      name: SCREENS.BusinessEventPreview,
      component: BusinessEventPreviewScreen,
    },
    {
      name: SCREENS.CreateEvent,
      component: CreateEventScreen,
    },
    {
      name: SCREENS.EventDetail,
      component: EventDetailScreen,
    },
    {
      name: SCREENS.UserMoments,
      component: UserMomentsScreen,
    },
    {
      name: SCREENS.UserEvents,
      component: UserEventsScreen,
    },
    {
      name: SCREENS.EditLocationMap,
      component: EditLocationMapScreen,
    },
    {
      name: SCREENS.EventUsersList,
      component: EventUsersListScreen,
    },
    {
      name: SCREENS.UserSearch,
      component: UserSearchScreen,
    },
    {
      name: SCREENS.Spots,
      component: SpotsScreen,
    },
    {
      name: SCREENS.BusinessSpots,
      component: BusinessSpotsScreen,
    },
    {
      name: SCREENS.CreateSpot,
      component: CreateSpotScreen,
    },
    {
      name: SCREENS.SpotReplies,
      component: SpotRepliesScreen,
    },
    {
      name: SCREENS.QrScanner,
      component: QrScannerScreen,
    },
    {
      name: SCREENS.MyEvents,
      component: MyEventsScreen,
    },
  ],

  MODALS: [
    { name: SCREENS.AddLink, component: AddLinkModal },
    {
      name: SCREENS.CountryPicker,
      component: CountryPickerModal,
    },
    {
      name: SCREENS.VenueFilter,
      component: VenueFiltersModal,
    },
    {
      name: SCREENS.VenueMap,
      component: VenueMapModal,
    },
    {
      name: SCREENS.VenueDescription,
      component: VenueDescriptionModal,
    },
    {
      name: SCREENS.MapSelector,
      component: MapSelectorModal,
    },
    {
      name: SCREENS.VenueTimetable,
      component: VenueTimetableModal,
    },
    {
      name: SCREENS.Reaction,
      component: ReactionModal,
    },
    {
      name: SCREENS.ProfileStuffs,
      component: ProfileStuffsModal,
    },
    {
      name: SCREENS.MenuModal,
      component: MenuModal,
    },
    {
      name: SCREENS.DeleteVenue,
      component: DeleteVenueModal,
    },
    {
      name: SCREENS.InsightInfo,
      component: InsightInfoModal,
    },
    {
      name: SCREENS.Calendar,
      component: CalendarModal,
    },
    {
      name: SCREENS.AddLocation,
      component: AddLocationModal,
    },
    {
      name: SCREENS.Share,
      component: ShareModal,
    },
    {
      name: SCREENS.Web,
      component: WebViewScreen,
    },
    {
      name: SCREENS.CustomVenueFeature,
      component: CustomVenueFeatureModal,
    },
    {
      name: SCREENS.EditAddress,
      component: EditAddressModal,
    },
    {
      name: SCREENS.CreateMoment,
      component: CreateMomentScreen,
    },
    {
      name: SCREENS.PreviewMoment,
      component: MomentPreviewScreen,
    },
    {
      name: SCREENS.AddBusiness,
      component: AddBusinessModal,
    },
    {
      name: SCREENS.Report,
      component: ReportModal,
    },
    {
      name: SCREENS.EditUsername,
      component: EditUsernameModal,
    },
    {
      name: SCREENS.EditName,
      component: EditNameModal,
    },
    {
      name: SCREENS.EditBio,
      component: EditBioModal,
    },
    {
      name: SCREENS.EditInstagram,
      component: EditInstagramModal,
    },
    {
      name: SCREENS.EditPhone,
      component: EditPhoneModal,
    },
    {
      name: SCREENS.EditLink,
      component: EditLinkModal,
    },
    {
      name: SCREENS.ContactUs,
      component: ContactUsModal,
    },
    {
      name: SCREENS.DateTimePicker,
      component: DateTimePickerModal,
    },
    {
      name: SCREENS.Languages,
      component: LanguagesModal,
    },
    {
      name: SCREENS.MomentFilters,
      component: MomentFiltersModal,
    },
    {
      name: SCREENS.Tutorial,
      component: TutorialModal,
    },
    {
      name: SCREENS.ChangeProfilePicture,
      component: ChangeProfilePictureModal,
    },
    {
      name: SCREENS.EditBusinessInfo,
      component: EditBusinessModal,
    },
    {
      name: SCREENS.BusinessShare,
      component: BusinessShareModal,
    },
    {
      name: SCREENS.MomentParticipants,
      component: MomentParticipantsModal,
    },
    {
      name: SCREENS.AddParticipants,
      component: AddParticipantsModal,
    },
    {
      name: SCREENS.SleekLogin,
      component: SleekLoginModal,
    },
    {
      name: SCREENS.InviteFriends,
      component: InviteFriendsModal,
    },
    {
      name: SCREENS.ChooseBusinessToCreate,
      component: ChooseBusinessToCreateModal,
    },
    {
      name: SCREENS.BusinessAcceptTerms,
      component: BusinessAcceptTermsModal,
    },
    {
      name: SCREENS.ReserveOptions,
      component: ReserveOptionsModal,
    },
    {
      name: SCREENS.MyProfilesList,
      component: MyProfilesListModal,
    },
    {
      name: SCREENS.EventParticipants,
      component: EventParticipantsModal,
    },
  ],
};

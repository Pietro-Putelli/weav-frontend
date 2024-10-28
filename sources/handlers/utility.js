import { EventRegister } from "react-native-event-listeners";
import { eventlisteners } from "../constants";

export const switchingProfile = () => {
  EventRegister.emit(eventlisteners.SWITCHING_PROFILE);
};

export const stopSwitchingProfile = () => {
  EventRegister.emit(eventlisteners.STOP_SWITCHING_PROFILE);
};

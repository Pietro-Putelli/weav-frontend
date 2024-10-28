import React from "react";
import { VenueInfoView } from "../../components/venue";
import ModalScreen from "../ModalScreen";

const VenueDescriptionModal = ({ componentId, venue, ...props }) => {
  return (
    <ModalScreen cursor componentId={componentId}>
      <VenueInfoView modal venue={venue} {...props} />
    </ModalScreen>
  );
};

export default VenueDescriptionModal;

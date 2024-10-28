import React, { forwardRef, useCallback, useMemo } from "react";
import { Dimensions } from "react-native";
import ViewShot from "react-native-view-shot";
import { MomentCell } from "../moments";
import EventShotCell from "./EventShotCell";
import VenueShotCell from "./VenueShotCell";

const { height } = Dimensions.get("window");

const ViewShotHandler = forwardRef(
  ({ isPreview, moment, event, business }, ref) => {
    const renderContent = useCallback(() => {
      if (moment) {
        return <MomentCell isShotPreview moment={moment} />;
      }

      if (event) {
        return <EventShotCell event={event} isPreview={isPreview} />;
      }

      return <VenueShotCell business={business} />;
    }, [moment, event, business]);

    const containerStyle = useMemo(() => {
      if (isPreview) {
        return {
          alignItems: "center",
        };
      }
      return {
        position: "absolute",
        top: height * 2,
      };
    }, [isPreview]);

    return (
      <ViewShot
        ref={ref}
        style={containerStyle}
        options={{ result: "tmpfile", format: "png" }}
      >
        {renderContent()}
      </ViewShot>
    );
  }
);

export default ViewShotHandler;

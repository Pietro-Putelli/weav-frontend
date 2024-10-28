import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FullScreenLoader } from "../../components/loaders";
import { SocialShareCarousel } from "../../components/shares";
import ViewShotHandler from "../../components/viewshots/ViewShotHandler";
import { useCurrentBusiness } from "../../hooks";
import {
  formatShareBusiness,
  shareOnInstagram,
  shareOnSocial,
} from "../../utility/shareApis";
import ModalScreen from "../ModalScreen";

const BusinessShareModal = () => {
  const { business } = useCurrentBusiness();

  const businessId = business.id;
  const formattedBusiness = formatShareBusiness(business);

  const [isLoading, setIsLoading] = useState(false);

  const shotRef = useRef();

  const onSharePress = (type) => {
    shareOnSocial({
      type,
      businessId,
      onInstagram: () => {
        setIsLoading(true);

        shotRef.current.capture().then((data) => {
          shareOnInstagram(data, () => {
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          });
        });
      },
    });
  };

  return (
    <ModalScreen contentStyle={{ paddingHorizontal: 0 }} cursor>
      <ViewShotHandler ref={shotRef} isPreview business={formattedBusiness} />

      <View style={{ marginTop: "8%", marginBottom: "2%" }}>
        <SocialShareCarousel
          disableReport
          onPress={onSharePress}
          contentContainerStyle={{ paddingBottom: 8 }}
        />
      </View>

      <FullScreenLoader style={StyleSheet.absoluteFill} isLoading={isLoading} />
    </ModalScreen>
  );
};

export default BusinessShareModal;

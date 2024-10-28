import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfirmView } from "../../components/badgeviews";
import { HorizontalCarousel } from "../../components/lists";
import { FullScreenLoader } from "../../components/loaders";
import { SocialShareCarousel } from "../../components/shares";
import ViewShotHandler from "../../components/viewshots/ViewShotHandler";
import {
  useCurrentBusiness,
  useLanguages,
  useMyBusinessEvents,
} from "../../hooks";
import {
  copyLinkFor,
  formatShareEventForInstagram,
  shareMore,
  shareOnInstagram,
  shareOnSocial,
  shareOnTelegram,
  shareOnWhatsApp,
} from "../../utility/shareApis";
import FullSheetModal from "../FullSheetModal";
import { FadeAnimatedView } from "../../components/animations";

const { width } = Dimensions.get("window");
const TRANSLATE_X_VALUE = width * 0.18;

const BusinessEventShareModal = ({ eventId }) => {
  const { businessId } = useCurrentBusiness();

  const { event, slices, lastIndex } = useMyBusinessEvents({ eventId });

  const { languageContent } = useLanguages();

  const [isLoading, setIsLoading] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);

  const shotRef = useRef();
  const scrollX = useSharedValue(0);

  const eventStickers = useMemo(() => {
    return slices.map((slice) => {
      return formatShareEventForInstagram({ event, slice });
    });
  }, [slices]);

  const eventHasMultupleSlices = useMemo(() => {
    return slices?.length > 0;
  }, [slices]);

  const [selectedSliceIndex, setSelectedSliceIndex] = useState(lastIndex);

  const viewShotRefs = useMemo(() => {
    if (eventHasMultupleSlices) {
      return slices.map(() => React.createRef());
    }
    return null;
  }, [slices]);

  const currentViewShotRef = useMemo(() => {
    if (eventHasMultupleSlices) {
      return viewShotRefs[selectedSliceIndex];
    }
    return shotRef;
  }, [selectedSliceIndex]);

  const onSharePress = (type) => {
    shareOnSocial({
      type,
      businessId,
      onInstagram: () => {
        setIsLoading(true);

        currentViewShotRef.current.capture().then((data) => {
          shareOnInstagram(data, () => {
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          });
        });
      },
      onCopy: () => {
        setBadgeVisible(true);
      },
    });
  };

  const onSnapToItem = useCallback(
    ({ index }) => {
      if (index != selectedSliceIndex) {
        setSelectedSliceIndex(index);
      }
    },
    [selectedSliceIndex]
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <View style={styles.sliceContainer}>
          <ViewShotHandler
            scrollX={scrollX}
            ref={viewShotRefs[index]}
            isPreview
            event={item}
          />
        </View>
      );
    },
    [viewShotRefs]
  );

  return (
    <FullSheetModal removePadding>
      <FadeAnimatedView style={{ flex: 1 }}>
        <View style={{ marginTop: "2%" }}>
          <HorizontalCarousel
            scrollX={scrollX}
            hapticEnabled
            data={eventStickers}
            renderItem={renderItem}
            itemWidth={width}
            sliderWidth={width}
            keyExtractor={(_, index) => index}
            initialScrollIndex={lastIndex}
            onSnapToItem={onSnapToItem}
            fastSelectionEnabled
            translateXValue={TRANSLATE_X_VALUE}
          />
        </View>
      </FadeAnimatedView>

      <SafeAreaView style={{ marginBottom: "6%" }}>
        <SocialShareCarousel onPress={onSharePress} />
      </SafeAreaView>

      <FullScreenLoader isLoading={isLoading} />

      <ConfirmView
        visible={badgeVisible}
        setVisible={setBadgeVisible}
        title={languageContent.action_feedbacks.copied}
      />
    </FullSheetModal>
  );
};

export default memo(BusinessEventShareModal);

const styles = StyleSheet.create({
  sliceContainer: { alignItems: "center", justifyContent: "center", width },
});

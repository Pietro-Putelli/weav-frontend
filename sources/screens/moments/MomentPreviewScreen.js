import { isUndefined } from "lodash";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedModalBackgroundView } from "../../components/animations";
import { SquareImage } from "../../components/images";
import { EventCell, MomentCell } from "../../components/moments";
import { useCurrentBusiness, useUser } from "../../hooks";
import { icons, insets } from "../../styles";
import { formatMomentPreview } from "../../utility/formatters";

const MomentPreviewScreen = ({
  moment,
  isChatPreview,
  isInteractable,
  initialSliceIndex,
  componentId,
}) => {
  const navigation = useNavigation();

  const { username, picture } = useUser();
  const user = { username, picture };

  const { isBusiness } = useCurrentBusiness();

  const isEvent = !isUndefined(moment?.business) || isBusiness;

  const preview = useMemo(() => {
    return formatMomentPreview({ moment, user });
  }, [moment]);

  const onDismissPress = () => {
    navigation.dismissModal();
  };

  const sharedProps = useMemo(() => {
    const props = {
      componentId,
    };

    if (isChatPreview) {
      return { ...props, moment };
    }

    return {
      ...props,
      isPreview: !isInteractable,
      moment: preview,
      initialSliceIndex,
    };
  }, [moment, isInteractable]);

  const renderMoment = () => {
    if (isEvent) {
      return <EventCell {...sharedProps} />;
    }

    return <MomentCell {...sharedProps} />;
  };

  return (
    <AnimatedModalBackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>{renderMoment()}</View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onDismissPress}
          style={styles.dismiss_container}
        >
          <SquareImage percentage={0.8} source={icons.Cross} />
        </TouchableOpacity>
      </SafeAreaView>
    </AnimatedModalBackgroundView>
  );
};

export default MomentPreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dismiss_container: {
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "4%",
  },
  signifier_container: {
    top: insets.top + 16,
    position: "absolute",
    alignSelf: "center",
  },
});

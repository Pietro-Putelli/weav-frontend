import { isUndefined } from "lodash";
import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { icons } from "../../styles";
import {
  MomentCellSize,
  getEventCellSize,
  getPictureHeight,
} from "../../styles/sizes";
import { AND } from "../../utility/boolean";
import { FadeAnimatedView } from "../animations";
import { IconButton } from "../buttons";
import { CacheableImageView, LocalSource } from "../images";

const MomentPreviewContainer = ({ moment, onRemoveSourcePress, onLoadEnd }) => {
  const momentBusiness = moment?.business_tag;
  const event = moment?.event;

  const businessSource = momentBusiness?.source ?? momentBusiness?.cover_source;

  const source = useMemo(() => {
    return moment?.source ?? businessSource ?? event?.cover;
  }, [moment]);

  const isEvent = !isUndefined(event);

  const isLocalSource = AND(!businessSource, !isEvent);

  const sourceStyle = useMemo(() => {
    if (source == null) {
      return {};
    }

    let response = {
      borderRadius: 16,
      width: MomentCellSize.width,
    };

    if (isEvent) {
      const { height } = getEventCellSize({ ratio: event.ratio });

      response.height = height;
    } else {
      response.height = getPictureHeight(source);
    }

    return response;
  }, [event, moment]);

  if (source == null) {
    return null;
  }

  return (
    <FadeAnimatedView style={styles.container}>
      <View style={styles.remove_button}>
        <IconButton
          blur
          side={"five"}
          source={icons.Cross}
          onPress={onRemoveSourcePress}
        />
      </View>

      {isLocalSource ? (
        <LocalSource
          source={source}
          style={sourceStyle}
          onLoadEnd={onLoadEnd}
        />
      ) : (
        <CacheableImageView
          style={sourceStyle}
          source={source?.uri ?? source}
        />
      )}
    </FadeAnimatedView>
  );
};

export default memo(MomentPreviewContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: "3%",
    overflow: "hidden",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 12,
    borderRadius: 16,
    paddingBottom: 16,
    justifyContent: "flex-end",
    ...StyleSheet.absoluteFillObject,
  },
  remove_button: {
    top: 12,
    right: 12,
    zIndex: 5,
    position: "absolute",
  },
  play_icon: {
    position: "absolute",
    zIndex: 2,
  },
  audio_button: {
    bottom: 12,
    position: "absolute",
    right: 12,
  },
});

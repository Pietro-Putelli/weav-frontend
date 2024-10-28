import { FlashList } from "@shopify/flash-list";
import { isNull } from "lodash";
import React, { memo, useCallback, useMemo } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { imagesizes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useMediaLibrary, useTheme, useUser } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { openPicker } from "../../utility/imagepicker";
import { FadeAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { MediaLibraryPlaceholder } from "../placeholders";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");
const CELL_WIDTH = (width - 16) / 4;

const RecentPicksView = ({
  componentId,
  style,
  resizeOptions,
  onAssetSelected,
}) => {
  const theme = useTheme();
  const { assets } = useMediaLibrary({ bulkCount: 15 });

  const { permissions } = useUser();
  const { languageContent } = useLanguages();

  const navigation = useNavigation();

  const data = useMemo(() => {
    const data = [null, ...assets.slice(0, 15)];

    if (componentId) {
      data[15] = null;
    }

    return data;
  }, [assets]);

  /* Callbacks */

  const onCameraPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.Camera,
      passProps: {
        isActive: true,
        isLibraryDisabled: true,
        onMediaCaptured: (asset) => {
          onAssetSelected(asset);

          setTimeout(() => {
            navigation.pop();
          }, 100);
        },
      },
    });
  };

  const onMediaLibraryPress = () => {
    openPicker({ ...resizeOptions, cropping: false }, (image) => {
      onAssetSelected(image);
    });
  };

  /* Components */

  const renderItem = useCallback(({ item, index }) => {
    return (
      <FadeAnimatedView mode="fade" style={styles.cell}>
        {!isNull(item) ? (
          <TouchableOpacity
            onPress={() => {
              onAssetSelected(item);
            }}
            activeOpacity={0.8}
            style={styles.cell}
          >
            <Image source={item} style={styles.asset} />
          </TouchableOpacity>
        ) : (
          <BounceView
            onPress={() => {
              if (index == 0) {
                onCameraPress();
              } else {
                onMediaLibraryPress();
              }
            }}
            style={{
              padding: 12,
              borderRadius: 22,
              backgroundColor: theme.colors.main_accent,
            }}
          >
            <SquareImage
              source={index == 0 ? icons.Camera : icons.Library}
              side={CELL_WIDTH / 3.5}
            />
          </BounceView>
        )}
      </FadeAnimatedView>
    );
  }, []);

  if (!permissions.media) {
    return <MediaLibraryPlaceholder />;
  }

  return (
    <FadeAnimatedView delay={200} style={[styles.container, style]}>
      <MainText
        style={styles.title}
        align={"center"}
        uppercase
        font="subtitle-2"
        bold
      >
        {languageContent.recent_picks_content}
      </MainText>

      <View style={[styles.list_container, theme.styles.shadow_round]}>
        <FlashList
          data={data}
          numColumns={4}
          renderItem={renderItem}
          scrollEnabled={false}
          estimatedItemSize={CELL_WIDTH}
        />
      </View>
    </FadeAnimatedView>
  );
};

export default memo(RecentPicksView);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
  },
  list_container: {
    overflow: "hidden",
    height: CELL_WIDTH * 4,
    width: CELL_WIDTH * 4,
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  cellContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  asset: {
    width: CELL_WIDTH * 0.99,
    height: CELL_WIDTH * 0.99,
  },
  title: {
    marginBottom: "4%",
  },
});

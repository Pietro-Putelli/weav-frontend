import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "react-native-navigation-hooks/dist";
import { SCREENS } from "../../constants/screens";
import { useLanguages, useTheme } from "../../hooks";
import { showModalNavigation } from "../../navigation/actions";
import { icons, insets } from "../../styles";
import { IconButton } from "../buttons";
import { MainText } from "../texts";
import { BounceView } from "../views";

const MediaLibraryTitle = ({
  title,
  disabled,
  onClosePress,
  allowOnlyPhoto,
  onAlbumSelected,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { languageContent } = useLanguages();

  const backgroundColor = theme.colors.second_background;

  const onPress = () => {
    showModalNavigation({
      screen: SCREENS.AlbumsList,
      passProps: { allowOnlyPhoto, onSelected: onAlbumSelected },
    });
  };

  const containerStyle = useMemo(() => {
    return {
      paddingTop: insets.top + 8,
      paddingBottom: 16,
      backgroundColor,
    };
  }, []);

  return (
    <View style={containerStyle}>
      <View style={styles.content}>
        <IconButton
          inset={3}
          onPress={() => {
            if (onClosePress) {
              onClosePress();
            } else {
              navigation.dismissModal();
            }
          }}
          style={styles.back_container}
          source={icons.Cross}
        />

        <BounceView
          disabledWithoutOpacity={true}
          style={styles.content}
          onPress={onPress}
        >
          {/* <SquareImage
            side={ICON_SIZES.five}
            style={{ marginRight: 8 }}
            source={icons.Chevrons.Down}
          /> */}
          <MainText font="title-8">{languageContent.your_library}</MainText>
        </BounceView>
      </View>
    </View>
  );
};

export default memo(MediaLibraryTitle);

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  back_container: {
    left: 8,
    position: "absolute",
  },
});

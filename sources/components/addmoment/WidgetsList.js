import React, { memo, useCallback, useMemo } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { actiontypes } from "../../constants";
import { SCREENS } from "../../constants/screens";
import { formatMinutes } from "../../dates/formatters";
import { useLanguages, useTheme } from "../../hooks";
import {
  showModalNavigation,
  showSheetNavigation,
} from "../../navigation/actions";
import { icons } from "../../styles";
import { excludeIndexs } from "../../utility/collections";
import { isAndroidDevice } from "../../utility/functions";
import { ScaleAnimatedView } from "../animations";
import { CreateContentButton } from "../buttons";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { BounceView } from "../views";

const WIDGETS = [
  {
    type: "participants",
    icon: icons.Friends,
    screen: SCREENS.AddParticipants,
  },
  {
    type: "source",
    icon: icons.Camera,
    screen: SCREENS.Camera,
  },
  {
    type: "business_tag",
    icon: icons.Cocktail,
    screen: SCREENS.AddBusiness,
  },
  {
    type: "url_tag",
    icon: icons.Link,
    screen: SCREENS.AddLink,
  },
  {
    type: "location_tag",
    icon: icons.Marker1,
    screen: SCREENS.AddLocation,
  },
];

const { width } = Dimensions.get("window");
export const WIDGET_CELL_SIDE = (width - 4 * 4) / 8;
const USE_POINT_SIDE = 8;
const WIDGET_ICON_SIDE = WIDGET_CELL_SIDE / 2.3;

const isAndroid = isAndroidDevice();

const WidgetsList = ({
  disabled,
  activeWidgets,
  onPickedWidget,
  onDonePress,
  doneEnabled,
  isDoneLoading,
  isSliceEditor,
  isRepostingEvent,
  onSourcePress,
  duration,
  onDurationChanged,
  onAddParticipantsPress,
  businessDisabled,
}) => {
  const theme = useTheme();
  const { languageContent } = useLanguages();

  /* Callbacks */

  const onPress = ({ screen, type }) => {
    if (type == "source") {
      onSourcePress();
      return;
    }

    if (type == "participants") {
      onAddParticipantsPress();
      return;
    }

    showModalNavigation({
      screen,
      passProps: {
        onGoBack: (item) => {
          onPickedWidget({ type, item });
        },
      },
    });
  };

  const onDatePress = useCallback(() => {
    Keyboard.dismiss();

    showSheetNavigation({
      screen: SCREENS.DateTimePicker,
      passProps: {
        type: actiontypes.PICKERS.DURATION,
        value: duration,
        onValueChanged: onDurationChanged,
        title: languageContent.choose_moment_duration,
      },
    });
  }, [duration, onDurationChanged]);

  /* Props */

  const widgets = useMemo(() => {
    if (isRepostingEvent) {
      return excludeIndexs(WIDGETS, 1, 2);
    }

    if (isSliceEditor) {
      return excludeIndexs(WIDGETS, 0, 1, 2);
    }

    if (businessDisabled) {
      return excludeIndexs(WIDGETS, 2);
    }

    return WIDGETS;
  }, [isSliceEditor, businessDisabled, isRepostingEvent]);

  /* Styles */

  const cellStyle = useMemo(() => {
    return {
      ...styles.cell,
      ...theme.styles.shadow_round,
      borderRadius: WIDGET_CELL_SIDE / 2.2,
    };
  }, []);

  const usedViewStyle = useMemo(() => {
    return {
      ...styles.usedView,
      backgroundColor: theme.colors.main_accent,
    };
  }, []);

  const containerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round_second,
      borderRadius: 0,
      marginBottom: isAndroid ? -16 : 0,
      ...styles.container,
    };
  }, []);

  const dateContainerStyle = useMemo(() => {
    return {
      ...theme.styles.shadow_round,
      ...styles.dateContainer,
      backgroundColor: theme.colors.main_accent,
    };
  }, []);

  return (
    <View style={containerStyle}>
      <View style={styles.content}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          horizontal
        >
          {onDurationChanged && (
            <BounceView onPress={onDatePress} style={dateContainerStyle}>
              <MainText bold font="subtitle-1">
                {formatMinutes({ minutes: duration })}
              </MainText>
            </BounceView>
          )}

          {widgets.map(({ screen, type, icon }, index) => {
            return (
              <BounceView
                key={index}
                style={cellStyle}
                disabled={(!doneEnabled && index == 6) || disabled}
                onPress={() => onPress({ screen, type })}
              >
                {activeWidgets[type] && (
                  <ScaleAnimatedView style={usedViewStyle} />
                )}
                <SquareImage side={WIDGET_ICON_SIDE} source={icon} />
              </BounceView>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ marginLeft: "1%" }}>
        <CreateContentButton
          style={cellStyle}
          onPress={onDonePress}
          disabled={!doneEnabled}
          isLoading={isDoneLoading}
          iconSide={WIDGET_ICON_SIDE}
        />
      </View>
    </View>
  );
};

export default memo(WidgetsList);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "1%",
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    width: WIDGET_CELL_SIDE,
    height: WIDGET_CELL_SIDE,
    marginHorizontal: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  usedView: {
    position: "absolute",
    width: USE_POINT_SIDE,
    height: USE_POINT_SIDE,
    borderRadius: USE_POINT_SIDE / 2.2,
    right: 3,
    top: 3,
  },
  gradient: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    borderRadius: WIDGET_CELL_SIDE / 2.2,
  },
  dateContainer: {
    marginHorizontal: 3,
    height: WIDGET_CELL_SIDE,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: WIDGET_CELL_SIDE / 2.5,
  },
});

import moment from "moment";
import { memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { MainText } from "../texts";
import { BounceView } from "../views";

const { width } = Dimensions.get("window");
const CELL_SIDE = (width - 16) / 7;

const DayCell = ({ day, markedDays, onPress }) => {
  const theme = useTheme();

  const { selectedFrom, selectedTo, shadow } = useMemo(() => {
    const { from, to } = markedDays;

    const fromDate = moment(from);
    const toDate = moment(to);

    const selectedFrom = markedDays.from == day;
    const selectedTo = markedDays.to == day;

    return {
      selectedFrom,
      selectedTo,
      shadow: moment(day).isBetween(fromDate, toDate),
    };
  }, [markedDays]);

  const startContainerStyle = useMemo(() => {
    return {
      ...styles.start_container,
      backgroundColor: theme.colors.main_accent,
    };
  }, []);

  const shadowContainerStyle = useMemo(() => {
    return {
      ...styles.shadow,
      backgroundColor: theme.colors.main_accent_a,
    };
  }, []);

  const endContainerStyle = useMemo(() => {
    return {
      ...styles.end_container,
      backgroundColor: theme.colors.main_accent,
    };
  }, []);

  return (
    <FadeAnimatedView mode="fade">
      <BounceView onPress={onPress} style={styles.cell}>
        {selectedFrom && <View style={startContainerStyle} />}

        {shadow && <View style={shadowContainerStyle} />}

        {selectedTo && <View style={endContainerStyle} />}

        {day != -1 && (
          <MainText bold font="subtitle">
            {moment(day).format("DD")}
          </MainText>
        )}
      </BounceView>
    </FadeAnimatedView>
  );
};

export default memo(DayCell);

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIDE,
    height: CELL_SIDE,
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    marginVertical: 4,
    ...StyleSheet.absoluteFillObject,
  },
  start_container: {
    marginVertical: 4,
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: CELL_SIDE / 3,
    borderBottomLeftRadius: CELL_SIDE / 3,
  },
  end_container: {
    marginVertical: 4,
    ...StyleSheet.absoluteFillObject,
    borderTopRightRadius: CELL_SIDE / 3,
    borderBottomRightRadius: CELL_SIDE / 3,
  },
});

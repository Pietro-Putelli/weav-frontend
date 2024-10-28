import React, { useMemo } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useLanguages, useTheme } from "../../hooks";
import { ICON_SIZES } from "../../styles/sizes";
import { isNullOrUndefined } from "../../utility/boolean";
import { isNullOrEmpty } from "../../utility/strings";
import { CacheableImageView } from "../images";
import { SeparatorTitle } from "../separators";
import { MainText } from "../texts";
import TimetableCell from "./TimetableCell";

const { width } = Dimensions.get("window");

const ICON_SIDE = ICON_SIZES.one * 0.9;
const LOGO_SIDE = width / 3;

const VenueInfoView = ({ hasPosts, venue, modal }) => {
  const { timetable, amenities, description } = venue;

  const hasAbout = !isNullOrEmpty(description);
  const hasTimetable = !isNullOrUndefined(timetable);

  const { languageContent } = useLanguages();

  return (
    <View>
      {!hasPosts && hasAbout && (
        <SeparatorTitle style={{ marginTop: modal ? 0 : "3%" }} noBottom>
          {languageContent.separator_titles.about}
        </SeparatorTitle>
      )}

      <View>
        {hasAbout && (
          <View
            style={{
              marginTop: "2%",
              marginBottom: "2%",
              marginHorizontal: "2%",
            }}
          >
            <MainText
              font="subtitle-2"
              style={{ lineHeight: RFPercentage(2.8) }}
            >
              {description}
            </MainText>
          </View>
        )}

        {hasTimetable && <TimetableCell timetable={timetable} />}
      </View>

      {amenities != null && <QuickInfoView venue={venue} modal={modal} />}

      {hasPosts && (
        <SeparatorTitle style={{ marginTop: -8 }}>posts</SeparatorTitle>
      )}
    </View>
  );
};
export default VenueInfoView;

const QuickInfoView = ({ modal, venue }) => {
  const theme = useTheme();

  const cellSide = useMemo(() => {
    return (width - 24 - (modal ? 12 : 0) - 4 * 8) / 4;
  }, [modal]);

  let props;

  const hasAmenities = venue.amenities.length > 0;

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={[
          styles.iconCell,
          {
            marginRight: (index + 1) % 4 == 0 && modal ? 0 : 4,
            marginLeft: index == 0 || (modal && index % 4 == 0) ? 0 : 6,
            width: cellSide,
            height: cellSide,
          },
          theme.styles.shadow_round,
        ]}
      >
        <CacheableImageView
          coloredIcon
          source={item.icon}
          style={{ width: ICON_SIDE, height: ICON_SIDE }}
        />
        <MainText
          style={{ marginTop: "12%", marginHorizontal: 8 }}
          numberOfLines={2}
          align="center"
          font="subtitle-4"
          uppercase
          bold
        >
          {item.title}
        </MainText>
      </View>
    );
  };

  if (modal)
    props = {
      numColumns: 4,
      horizontal: false,
      scrollEnabled: false,
      columnWrapperStyle: { justifyContent: "flex-start" },
    };

  if (!hasAmenities) {
    return null;
  }

  return (
    <View style={{ marginTop: "2%" }}>
      <FlatList
        horizontal
        data={venue.amenities}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionText: {
    marginTop: "4%",
    textAlign: "center",
  },
  iconCell: {
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTitle: {
    marginTop: 8,
    marginHorizontal: 4,
  },
  logo: {
    borderRadius: 16,
    height: LOGO_SIDE,
    alignSelf: "center",
    width: LOGO_SIDE * 2,
  },
});

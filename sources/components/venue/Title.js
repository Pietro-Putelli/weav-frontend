import React, { memo, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { BounceView } from "../../components/views";
import { SCREENS } from "../../constants/screens";
import { useTheme, useUser } from "../../hooks";
import { pushNavigation } from "../../navigation/actions";
import { icons } from "../../styles";
import { ICON_SIZES } from "../../styles/sizes";
import {
  formatBusinessRankingTitle,
  formatLargeNumber,
} from "../../utility/formatters";
import { getDistance } from "../../utility/geolocation";
import { FirstLoadingAnimatedView } from "../animations";
import { SquareImage } from "../images";
import { MainText } from "../texts";
import { isEmpty } from "lodash";

const ICON_SIDE = ICON_SIZES.four;

const Title = ({ business, isLoading, componentId }) => {
  const theme = useTheme();
  const { coordinate: userCoordinate } = useUser();

  const businessRanking = business.ranking;

  const repostsCount = business.reposts_count ?? 0;

  /* Callbacks */

  const onRankingPress = () => {
    pushNavigation({
      componentId,
      screen: SCREENS.VenueRanking,
      passProps: { business },
    });
  };

  const distanceFromMe = useMemo(() => {
    const businessCoordinate = business?.location?.coordinate;

    if (!userCoordinate) {
      return "0 Km";
    }

    if (businessCoordinate) {
      return getDistance({
        coordinate1: userCoordinate,
        coordinate2: businessCoordinate,
        formatted: true,
      });
    }
    return "";
  }, [business]);

  /* Components */

  const renderSubtitle = () => {
    const category = business?.category;
    let categories = business?.categories ?? [];

    const hasCategories = !isEmpty(categories);

    if (category && !businessRanking) {
      categories = [business.category, ...categories];
    }

    let title = null;

    if (category && !isEmpty(categories)) {
      title = String(categories.map((category) => category?.title + " • "));

      if (title) {
        title = title.replaceAll(",", "");
      }
    }

    return (
      <View>
        {hasCategories && (
          <View style={{ flexDirection: "row", marginBottom: "3%" }}>
            <MainText bold font="subtitle-1" style={styles.category_title}>
              {title.slice(0, -2)}
            </MainText>
          </View>
        )}

        <View style={[styles.content, { marginTop: hasCategories ? 0 : 8 }]}>
          <Item
            title={repostsCount}
            source={icons.Repost}
            imageStyle={{ tintColor: theme.colors.main_accent }}
          />

          <Item
            source={icons.LikeFill}
            title={formatLargeNumber(business.likes)}
            imageStyle={{ tintColor: theme.colors.like }}
          />

          <Item
            source={icons.Marker}
            title={distanceFromMe}
            imageStyle={{ tintColor: theme.colors.blue }}
          />

          <PriceBar price={business.price_target} />
        </View>
      </View>
    );
  };

  return (
    <FirstLoadingAnimatedView isLoading={isLoading} style={{ marginLeft: 8 }}>
      {businessRanking != null && (
        <View style={styles.rank_container}>
          <BounceView onPress={onRankingPress} activeScale={0.95}>
            <MainText
              color={theme.colors.aqua}
              font="subtitle-1"
              style={styles.subtitle}
              bold
            >
              {formatBusinessRankingTitle(business)}
            </MainText>
          </BounceView>
        </View>
      )}
      {renderSubtitle()}
    </FirstLoadingAnimatedView>
  );
};
export default memo(Title);

const Item = ({ title, source, style, imageStyle }) => {
  const theme = useTheme();

  return (
    <View style={[styles.item_container, theme.styles.shadow_round, style]}>
      {source && (
        <SquareImage source={source} style={imageStyle} side={ICON_SIDE} />
      )}
      <MainText bold font="subtitle-3" style={styles.item_title}>
        {title}
      </MainText>
    </View>
  );
};

const PriceBar = ({ price }) => {
  const theme = useTheme();

  return (
    <View style={[theme.styles.shadow_round, styles.priceContainer]}>
      <View style={{ alignSelf: "flex-start" }}>
        <FlatList
          horizontal
          scrollEnabled={false}
          data={[...Array(price).keys()]}
          keyExtractor={(i) => i.toString()}
          renderItem={() => {
            return (
              <SquareImage
                side={16}
                source={icons.Dollar}
                color={theme.colors.green}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
    marginHorizontal: 8,
  },
  rank_container: {
    marginBottom: "2%",
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    marginRight: "2%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -4,
  },
  item_container: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 8,
    padding: 10,
    paddingHorizontal: 14,
  },
  item_title: {
    marginLeft: 8,
  },
  category_title: {
    marginRight: "2%",
  },
  shop_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceContainer: {
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
  },
});

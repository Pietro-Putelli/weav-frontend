import { isEmpty } from "lodash";
import React, { memo, useCallback } from "react";
import { FlatList } from "react-native";
import { actiontypes } from "../../constants";
import { useLanguages, useRecentSearch } from "../../hooks";
import { FadeAnimatedView } from "../animations";
import { LocationCell } from "../cells";
import { SeparatorTitle } from "../separators";

const SearchRecentHeader = ({ onLocationPress, mode }) => {
  const { recents } = useRecentSearch({ mode });
  const { languageContent } = useLanguages();

  const renderItem = useCallback(({ item }) => {
    return <LocationCell isRecent location={item} onPress={onLocationPress} />;
  }, []);

  if (mode == actiontypes.SEARCH_SCREEN.CITY) {
    if (isEmpty(recents)) {
      return null;
    }

    return (
      <FadeAnimatedView>
        <SeparatorTitle>
          {languageContent.separator_titles.recents}
        </SeparatorTitle>
        <FlatList data={recents} renderItem={renderItem} />

        <SeparatorTitle marginTop>
          {languageContent.separator_titles.cities}
        </SeparatorTitle>
      </FadeAnimatedView>
    );
  }
  return null;
};

export default memo(SearchRecentHeader);

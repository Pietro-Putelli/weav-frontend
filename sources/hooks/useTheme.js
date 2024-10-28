import { useEffect, useMemo, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { BORDER_RADIUS } from "../styles/sizes";

const borderRadius = BORDER_RADIUS;

const whiteAlpha = (alpha) => `rgba(255,255,255,${alpha})`;
const blackAlpha = (alpha) => `rgba(0,0,0,${alpha})`;

const THEME_COLORS = {
  dark: {
    background: "#090616",
    second_background: "#110D21",
    third_background: "#180D48",
    text: "white",
    secondText: whiteAlpha(0.7),
    thirdText: whiteAlpha(0.5),
    placeholderText: whiteAlpha(0.3),
    gradients: {},
  },
  light: {
    background: "#EFEFEF",
    second_background: "#E8EBEE",
    third_background: "#180D48",
    text: "#000000",
    secondText: blackAlpha(0.9),
    thirdText: blackAlpha(0.5),
    placeholderText: blackAlpha(0.5),
    gradients: {},
  },
};

const COLORS_PALETTE = {
  main_accent: "#3E08A3",
  main_accent_a: "#3F0B8795",
  aqua: "#186C70",
  orange: "#C47609",
  red: "#b31b1b",
  green: "#008132",
  like: "#911A00",
  mention: "#0286a1",
  blue: "#1d44b8",
};

const shadowOptions = {
  borderRadius,
  shadowColor: "black",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { x: 0, y: 0 },
};

const useTheme = () => {
  let colorScheme = useColorScheme();
  colorScheme = "dark";
  const themeColors = THEME_COLORS[colorScheme];
  const statusBarStyle =
    colorScheme == "dark" ? "light-content" : "dark-content";

  const styles = useMemo(() => {
    const firstBackground = themeColors.background;
    const secondBackground = themeColors.second_background;

    return {
      shadow: { ...shadowOptions, backgroundColor: secondBackground },
      shadow_round: {
        backgroundColor: secondBackground,
        ...shadowOptions,
      },
      shadow_round_second: {
        backgroundColor: firstBackground,
        ...shadowOptions,
      },
      shadow_round_half: {
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        backgroundColor: secondBackground,
        ...shadowOptions,
      },
      cell: {
        borderRadius,
        ...shadowOptions,
        backgroundColor: secondBackground,
        padding: "3%",
      },
      container: {
        flex: 1,
        backgroundColor: firstBackground,
      },
    };
  }, [colorScheme]);

  const colors = useMemo(() => {
    return {
      text: themeColors.text,
      ...themeColors,
      ...COLORS_PALETTE,
    };
  }, [colorScheme]);

  const getTheme = () => {
    return {
      white_alpha: whiteAlpha,
      colors,
      styles,
      keyboardAppearance: colorScheme,
    };
  };

  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    StatusBar.setBarStyle(statusBarStyle, true);

    setTheme(getTheme());
  }, [colorScheme]);

  return theme;
};

export default useTheme;

// const PICKER_COLORS = [
//   "#001B94", // blue - indigo bunting
//   "#40B5AD", // light blue - Verdigris
//   "#228B22", // green - forest green
//   "#f4ac0b", // yellow - Amber
//   "#FF5F1F", // Orange - Neon Orange
//   "#C11E1E", // Sunset
//   "#fc8eac", // Flamingo
//   "#6E260E", //Burnt Umber
//   "#71797E", // Steel
// ];
